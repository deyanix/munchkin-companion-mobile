package com.recadel.sjp.reactnative.manager;

import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.reactnative.SjpRunner;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ScheduledExecutorService;

public class SjpServerSocketManager extends SjpConnectionManager {
    private final ServerSocket serverSocket;

    public SjpServerSocketManager(int id, SjpRunner runner, ServerSocket serverSocket) {
        super(id, runner);
        this.serverSocket = serverSocket;
    }

    @Override
    public void start(ScheduledExecutorService executorService) {
        executorService.execute(() -> {
            emitEvent("start");
            while (!serverSocket.isClosed() && !executorService.isShutdown()) {
                try {
                    Socket socket = serverSocket.accept();
                    int id = getRunner().startExistingSocket(socket);

                    WritableMap map = createEventMap();
                    map.putInt("acceptedSocketId", id);
                    emitEvent("connect", map);
                } catch (IOException ex) {
                    WritableMap map = createEventMap();
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
