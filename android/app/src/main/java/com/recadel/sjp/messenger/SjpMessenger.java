package com.recadel.sjp.messenger;

import androidx.concurrent.futures.CallbackToFutureAdapter;

import com.google.common.util.concurrent.ListenableFuture;
import com.recadel.sjp.common.SjpMessage;
import com.recadel.sjp.common.SjpMessageBuffer;
import com.recadel.sjp.exception.SjpException;
import com.recadel.sjp.socket.SjpSocket;
import com.recadel.sjp.socket.SjpSocketListener;
import org.json.JSONException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class SjpMessenger {
    private final long id;
    private final SjpSocket socket;
    private final List<SjpMessengerReceiver> receivers = new ArrayList<>();
    private long nextRequestId = 1;

    public SjpMessenger(SjpSocket socket, long id) {
        this.socket = socket;
        this.id = id;
        socket.addListener(new SjpMessengerListener());
    }

    public SjpMessenger(SjpSocket socket) {
        this(socket, 0);
    }

    public void emit(String action, Object data) {
        try {
            socket.send(SjpMessage.createEvent(action, data).toBuffer());
        } catch (JSONException | IOException ex) {
            throw new SjpException("Error emitting event", ex);
        }
    }

    public void emit(String action) {
        emit(action, null);
    }

    public void response(long id, Object data) {
        try {
            socket.send(SjpMessage.createResponse(id, data).toBuffer());
        } catch (JSONException | IOException ex) {
            throw new SjpException("Error emitting response", ex);
        }
    }

    public void response(long id) {
        response(id, null);
    }

    public long request(String action, Object data) {
        try {
            final long messageId = nextRequestId++;
            socket.send(SjpMessage.createRequest(action, messageId, data).toBuffer());
            return messageId;
        } catch (JSONException | IOException ex) {
            throw new SjpException("Error requesting", ex);
        }
    }

    public long request(String action) {
        return request(action, null);
    }

    public void addReceiver(SjpMessengerReceiver receiver) {
        receivers.add(receiver);
    }

    public long getId() {
        return id;
    }

    public SjpSocket getSocket() {
        return socket;
    }

    private void handleException(Throwable ex) {
        receivers.forEach(listener -> listener.onError(ex));
    }

    class SjpMessengerListener implements SjpSocketListener {
        @Override
        public void onMessage(SjpMessageBuffer buffer) {
            try {
                SjpMessage message = SjpMessage.fromBuffer(buffer);
                String action = message.getAction();
                Object data = message.getData();
				switch (message.getType()) {
                    case EVENT:
                        receivers.forEach(receiver -> receiver.onEvent(action, data));
                        break;
                    case REQUEST:
                        receivers.forEach(receiver -> receiver.onRequest(message.getId(), action, data));
                        break;
                    case RESPONSE:
                        receivers.forEach(receiver -> receiver.onResponse(message.getId(), data));
                        break;
				}
            } catch (JSONException e) {
                throw new SjpException(e);
            }
        }

        @Override
        public void onError(Throwable ex) {
            handleException(ex);
        }

        @Override
        public void onClose() {
            receivers.forEach(SjpMessengerReceiver::onClose);
        }
    }
}
