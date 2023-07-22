package com.recadel.sjp.reactnative.manager;

import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.common.SjpReceiverGarbageCollector;
import com.recadel.sjp.reactnative.SjpModule;
import com.recadel.sjp.socket.SjpSocket;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ScheduledExecutorService;

public class SjpSocketServerManager extends SjpModuleManager {
    private final ServerSocket serverSocket;

    public SjpSocketServerManager(int id, SjpModule module, ScheduledExecutorService executorService, ServerSocket serverSocket) {
        super(id, module, executorService);
        this.serverSocket = serverSocket;
    }

    public SjpSocketServerManager(int id, SjpModule module, ServerSocket serverSocket) {
        this(id, module, null, serverSocket);
    }

    public void start() {
        getModule().getGarbageCollector().start();
        getExecutorService().execute(() -> {
            emitEvent("start");
            while (!serverSocket.isClosed() && !getExecutorService().isShutdown()) {
                try {
                    Socket socket = serverSocket.accept();
                    SjpSocket sjpSocket = new SjpSocket(socket, getExecutorService());
                    sjpSocket.applyGarbageCollector(getModule().getGarbageCollector());

                    int id = getModule().allocateSocketId();
                    SjpSocketManager manager = new SjpSocketManager(id, getModule(), sjpSocket);
                    getModule().addManager(manager);

                    WritableMap map = createMap();
                    map.putInt("acceptedSocketId", id);
                    emitEvent("connect", map);
                } catch (IOException ex) {
                    WritableMap map = createMap();
                    map.putString("message", ex.getMessage());
                    emitEvent("error", map);
                }
            }
            emitEvent("close");
        });
    }

    @Override
    public void close() throws IOException {
        serverSocket.close();
    }
}
