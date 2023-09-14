package com.munchkincompanion.game.finder;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.munchkincompanion.game.entity.Device;
import com.munchkincompanion.game.reactnative.ReactEventEmitter;
import com.recadel.sjp.common.SjpMessage;
import com.recadel.sjp.common.SjpMessagePattern;
import com.recadel.sjp.common.SjpMessageType;
import com.recadel.sjp.common.SjpReceiverGarbageCollector;
import com.recadel.sjp.discovery.SjpDiscoveryClient;
import com.recadel.sjp.messenger.SjpAbstractMessengerReceiver;
import com.recadel.sjp.messenger.SjpMessenger;
import com.recadel.sjp.socket.SjpSocket;

import org.json.JSONObject;

import java.io.Closeable;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.SocketException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class GameFinder implements Closeable {
    public static final SjpMessagePattern WELCOME_REQUEST_PATTERN = new SjpMessagePattern(SjpMessageType.REQUEST, "welcome", "look-for-trouble");
    public static final SjpMessagePattern WELCOME_RESPONSE_PATTERN = new SjpMessagePattern(SjpMessageType.RESPONSE, "welcome");
    private final Map<InetSocketAddress, GameFinderItem> sockets = new HashMap<>();
    private final SjpDiscoveryClient discoveryClient;
    private final ReactEventEmitter eventEmitter;

    public GameFinder(SocketAddress socketAddress, ReactEventEmitter eventEmitter) throws SocketException {
        this.eventEmitter = eventEmitter;

        discoveryClient = new SjpDiscoveryClient(socketAddress);
        discoveryClient.setWelcomeRequestPattern(WELCOME_REQUEST_PATTERN);
        discoveryClient.setWelcomeResponsePattern(WELCOME_RESPONSE_PATTERN);
    }

    public void start() {
        discoveryClient.discover(this::accept);

        final long deviceLifetime = discoveryClient.getInterval() * 2;
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> {
            Iterator<Map.Entry<InetSocketAddress, GameFinderItem>> iterator = sockets.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry<InetSocketAddress, GameFinderItem> entry = iterator.next();
                long duration = entry.getValue().getLastSeen()
                        .until(LocalDateTime.now(), ChronoUnit.MILLIS);

                if (duration > deviceLifetime) {
                    iterator.remove();
                }
            }
            emit();
        }, 0, deviceLifetime, TimeUnit.MILLISECONDS);
    }

    @Override
    public void close() {
        discoveryClient.close();
    }

    private void accept(InetSocketAddress address, SjpMessage message) {
        GameFinderItem item = sockets.getOrDefault(address, null);

        if (item == null) {
            item = new GameFinderItem();
            sockets.put(address, item);
        } else {
            item.see();
        }

        Object data = message.getData();
        assert data instanceof JSONObject;
        item.setDevice(Device.fromJSON((JSONObject) data));
        emit();
    }

    private void emit() {
        WritableArray array = Arguments.createArray();
        sockets.entrySet().forEach(entry -> {
            InetSocketAddress address = entry.getKey();
            GameFinderItem item = entry.getValue();
            if (item.getDevice() == null) {
                return;
            }

            WritableMap result = Arguments.createMap();
            result.putString("address", address.getAddress().getHostAddress());
            result.putInt("port", address.getPort());
            result.putMap("device", item.getDevice().toMap());
            array.pushMap(result);
        });
        eventEmitter.emit("discovery", array);
    }
}
