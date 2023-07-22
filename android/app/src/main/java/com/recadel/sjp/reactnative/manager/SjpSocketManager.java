package com.recadel.sjp.reactnative.manager;

import android.util.Base64;

import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.common.SjpMessageBuffer;
import com.recadel.sjp.reactnative.SjpModule;
import com.recadel.sjp.socket.SjpSocket;
import com.recadel.sjp.socket.SjpSocketListener;

import java.io.IOException;

public class SjpSocketManager extends SjpModuleManager implements SjpSocketListener {
    private final SjpSocket socket;

    public SjpSocketManager(int id, SjpModule module, SjpSocket socket) {
        super(id, module);
        this.socket = socket;
        socket.addListener(this);
        socket.setup();
    }

    public SjpSocket getSocket() {
        return socket;
    }

    @Override
    public void close() throws IOException {
        socket.close();
    }

    @Override
    public void onMessage(SjpMessageBuffer message) {
        WritableMap map = createMap();
        map.putString("data", Base64.encodeToString(message.getBuffer(), Base64.NO_WRAP));
        emitEvent("message", map);
    }

    @Override
    public void onError(String message) {
        WritableMap map = createMap();
        map.putString("message", message);
        emitEvent("error", map);
    }

    @Override
    public void onClose() {
        WritableMap map = createMap();
        emitEvent("close", map);
    }
}
