package com.recadel.sjp.messenger;

import com.recadel.sjp.common.SjpReceiverGarbageCollector;
import com.recadel.sjp.socket.SjpSocket;

import java.io.Closeable;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

public class SjpServerMediator implements Closeable {
    private final ServerSocket serverSocket;
    private final List<SjpMessenger> messengers = new ArrayList<>();
    private final List<SjpServerMessengerListener> listeners = new ArrayList<>();
    private SjpReceiverGarbageCollector garbageCollector;
    private long nextMessengerId = 0;
    private ExecutorService executorService;

    public SjpServerMediator(ServerSocket serverSocket) {
        this.serverSocket = serverSocket;
    }

    public void addListener(SjpServerMessengerListener listener) {
        listeners.add(listener);
    }

    public void start() {
        executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.execute(() -> {
            while (!serverSocket.isClosed() && !executorService.isShutdown()) {
                try {
                    Socket socket = serverSocket.accept();
                    SjpSocket sjpSocket = new SjpSocket(socket);
                    sjpSocket.applyGarbageCollector(garbageCollector);
                    sjpSocket.setup();

                    SjpMessenger messenger = new SjpMessenger(sjpSocket, nextMessengerId++);
                    messenger.addReceiver(new SjpServerMediatorReceiver(messenger));
                    messengers.add(messenger);
                    listeners.forEach(listener -> listener.onConnect(messenger));
                } catch (IOException ex) {
                    listeners.forEach(listener -> listener.onError(ex));
                }
            }
            listeners.forEach(SjpServerMessengerListener::onClose);
        });
    }

    public void broadcast(String action, Object data) {
        messengers.forEach(messenger -> messenger.emit(action, data));
    }

    public void broadcastExcept(String action, Object data, long exceptMessengerId) {
        messengers.stream()
                .filter(messenger -> messenger.getId() != exceptMessengerId)
                .forEach(messenger -> messenger.emit(action, data));
    }

    public SjpReceiverGarbageCollector getGarbageCollector() {
        return garbageCollector;
    }

    public void setGarbageCollector(SjpReceiverGarbageCollector garbageCollector) {
        this.garbageCollector = garbageCollector;
    }

    @Override
    public void close() throws IOException {
        if (executorService != null) {
            executorService.shutdown();
        }
        serverSocket.close();
    }

    class SjpServerMediatorReceiver extends SjpAbstractMessengerReceiver {
        private final SjpMessenger messenger;

        SjpServerMediatorReceiver(SjpMessenger messenger) {
            this.messenger = messenger;
        }
        @Override
        public void onClose() {
            messengers.remove(messenger);
        }
    }
}
