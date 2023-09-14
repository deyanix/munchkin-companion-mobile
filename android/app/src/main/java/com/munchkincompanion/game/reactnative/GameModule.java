package com.munchkincompanion.game.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.munchkincompanion.game.controller.GameController;
import com.munchkincompanion.game.controller.HostGameController;
import com.munchkincompanion.game.entity.Device;
import com.munchkincompanion.game.finder.GameFinder;
import com.recadel.sjp.common.SjpReceiverGarbageCollector;
import com.recadel.sjp.discovery.SjpDiscoveryServer;
import com.recadel.sjp.messenger.SjpServerMediator;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.SocketAddress;
import java.net.SocketException;

@ReactModule(name = GameModule.NAME)
public class GameModule extends ReactContextBaseJavaModule {
    public final static String NAME = "GameModule";
    private final ReactApplicationContext reactContext;
    private final ReactEventEmitter eventEmitter;
    private GameController gameController;
    private GameFinder gameFinder;

    public GameModule(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        this.eventEmitter = new ReactEventEmitter(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void startDiscovery(ReadableMap map) {
        String address = map.getString("address");
        int port = map.getInt("port");
        SocketAddress socketAddress = new InetSocketAddress(address, port);
        try {
            gameFinder = new GameFinder(socketAddress, eventEmitter);
            gameFinder.start();
        } catch (SocketException e) {
            this.eventEmitter.emit("error", e.getMessage());
        }
    }

    @ReactMethod
    public void closeDiscovery() {
        if (gameFinder != null) {
            gameFinder.close();
        }
        gameFinder = null;
    }

    @ReactMethod
    public void startHostGame(ReadableMap map) {
        int port = map.getInt("port");
        try {
            final SjpReceiverGarbageCollector garbageCollector = new SjpReceiverGarbageCollector();
            SjpDiscoveryServer discoveryServer = new SjpDiscoveryServer(port);
            discoveryServer.setWelcomeRequestPattern(GameFinder.WELCOME_REQUEST_PATTERN);
            discoveryServer.setWelcomeResponsePattern(
                    GameFinder.WELCOME_RESPONSE_PATTERN.withData(Device.getCurrent().toJSON()));
            discoveryServer.start();

            ServerSocket serverSocket = new ServerSocket(port);
            SjpServerMediator mediator = new SjpServerMediator(serverSocket);
            mediator.setGarbageCollector(garbageCollector);
            mediator.start();

            gameController = new HostGameController(discoveryServer, mediator);
        } catch (IOException e) {
            this.eventEmitter.emit("error", e.getMessage());
        }
    }

    @ReactMethod
    public void startGuestGame(ReadableMap map) {

    }

    @ReactMethod
    public void closeGame() {
        if (gameController == null) {
            return;
        }

        try {
            gameController.close();
        } catch (IOException e) {
            this.eventEmitter.emit("error", e.getMessage());
        }
        gameController = null;
    }

    @ReactMethod
    public void getPlayers(Callback callback) {
        if (gameController == null) {
            callback.invoke();
        } else {
            callback.invoke(gameController.getPlayers());
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }
}
