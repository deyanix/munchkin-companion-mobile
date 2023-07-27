package com.recadel.sjp.reactnative;

import android.content.Context;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.recadel.sjp.common.SjpReceiverGarbageCollector;
import com.recadel.sjp.discovery.SjpDiscoveryClient;
import com.recadel.sjp.discovery.SjpDiscoveryServer;
import com.recadel.sjp.reactnative.manager.SjpConnectionManager;
import com.recadel.sjp.reactnative.manager.SjpDiscoveryClientManager;
import com.recadel.sjp.reactnative.manager.SjpDiscoveryServerManager;
import com.recadel.sjp.reactnative.manager.SjpServerSocketManager;
import com.recadel.sjp.reactnative.manager.SjpSocketManager;
import com.recadel.sjp.socket.SjpSocket;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.function.Consumer;

public class SjpRunner {
    private final SjpManager manager;
    private final ReactApplication application;
    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(64);
    private final SjpReceiverGarbageCollector garbageCollector = new SjpReceiverGarbageCollector(executorService);

    public SjpRunner(SjpManager manager, Context context) {
        this.manager = manager;

        if (!(context instanceof ReactApplication)) {
            throw new IllegalArgumentException("Context is not React Application");
        }
        this.application = (ReactApplication) context;
    }

    public int startDiscoveryServer(int port) throws SocketException, UnknownHostException {
        int id = manager.allocateSocketId();
        SjpDiscoveryServer server = new SjpDiscoveryServer(port);
        startConnection(new SjpDiscoveryServerManager(id, this, server));
        return id;
    }

    public int startDiscoveryClient(InetSocketAddress address) throws SocketException {
        int id = manager.allocateSocketId();
        SjpDiscoveryClient client = new SjpDiscoveryClient(address);
        SjpDiscoveryClientManager connection = new SjpDiscoveryClientManager(id, this, client);
        startConnection(connection);
        return id;
    }

    public int startServerSocket(int port) throws IOException {
        int id = manager.allocateSocketId();
        ServerSocket socket = new ServerSocket(port);
        startConnection(new SjpServerSocketManager(id, this, socket));
        return id;
    }

    public void startSocket(Consumer<Integer> consumer, String address, int port) {
        executorService.submit(() -> {
            try {
                int id = startExistingSocket(new Socket(address, port));
                consumer.accept(id);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    public int startExistingSocket(Socket socket) {
        int id = manager.allocateSocketId();
        SjpSocket sjpSocket = new SjpSocket(socket);
        sjpSocket.applyGarbageCollector(garbageCollector);
        startConnection(new SjpSocketManager(id, this, sjpSocket));
        return id;
    }

    public ReactApplication getApplication() {
        return application;
    }

    public SjpManager getManager() {
        return manager;
    }

    public void stop() {
        executorService.shutdown();
    }

    public ReactContext getReactContext() {
        return application
                .getReactNativeHost()
                .getReactInstanceManager()
                .getCurrentReactContext();
    }

    public void emitEvent(String name, Object data) {
        getReactContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(name, data);
    }

    private void startConnection(SjpConnectionManager connection) {
        garbageCollector.start();
        manager.addConnection(connection);
        connection.start(executorService);
    }
}
