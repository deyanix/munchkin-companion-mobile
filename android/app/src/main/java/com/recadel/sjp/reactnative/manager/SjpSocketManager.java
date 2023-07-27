package com.recadel.sjp.reactnative.manager;

import android.util.Base64;

import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.common.SjpMessageBuffer;
import com.recadel.sjp.reactnative.SjpRunner;
import com.recadel.sjp.socket.SjpSocket;
import com.recadel.sjp.socket.SjpSocketListener;

import java.io.IOException;
import java.util.concurrent.ScheduledExecutorService;

public class SjpSocketManager extends SjpConnectionManager implements SjpSocketListener {
    private final SjpSocket socket;

    public SjpSocketManager(int id, SjpRunner runner, SjpSocket socket) {
        super(id, runner);
        this.socket = socket;
        socket.addListener(this);
    }

    public SjpSocket getSocket() {
        return socket;
    }

    @Override
    public void start(ScheduledExecutorService executorService) {
        socket.setup(executorService);
    }

    @Override
    public void close() throws IOException {
        socket.close();
    }

    @Override
    public void onMessage(SjpMessageBuffer message) {
        WritableMap map = createEventMap();
        map.putString("data", Base64.encodeToString(message.getBuffer(), Base64.NO_WRAP));
        emitEvent("message", map);
    }

    @Override
    public void onError(String message) {
        WritableMap map = createEventMap();
        map.putString("message", message);
        emitEvent("error", map);
    }

    @Override
    public void onClose() {
        WritableMap map = createEventMap();
        emitEvent("close", map);
    }
}
