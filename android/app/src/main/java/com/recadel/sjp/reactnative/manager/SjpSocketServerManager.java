package com.recadel.sjp.reactnative.manager;

import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.common.SjpReceiverGarbageCollector;
import com.recadel.sjp.reactnative.SjpModule;
import com.recadel.sjp.socket.SjpSocket;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class SjpSocketServerManager extends SjpModuleManager {
    private final ServerSocket serverSocket;
    private final SjpReceiverGarbageCollector garbageCollector;

    public SjpSocketServerManager(int id, SjpModule module, ServerSocket serverSocket, SjpReceiverGarbageCollector garbageCollector) {
        super(id, module);
        this.serverSocket = serverSocket;
        this.garbageCollector = garbageCollector;
    }

    public void start() {
        getExecutorService().submit(() -> {
           while (!serverSocket.isClosed() && !getExecutorService().isShutdown()) {
               try {
                   Socket socket = serverSocket.accept();
                   SjpSocket sjpSocket = new SjpSocket(socket, getExecutorService());
                   sjpSocket.applyGarbageCollector(garbageCollector);

                   int id = getModule().allocateSocketId();
                   SjpSocketManager manager = new SjpSocketManager(id, getModule(), sjpSocket);
                   getModule().addManager(manager);

                   WritableMap map = createMap();
                   map.putInt("acceptedSocketId", id);
                   emitEvent("connect", map);
               } catch (IOException ignored) {
               }
           }
        });
    }

    @Override
    public void close() throws IOException {
        serverSocket.close();
    }
}
