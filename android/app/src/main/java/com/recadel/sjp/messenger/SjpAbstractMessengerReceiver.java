package com.recadel.sjp.messenger;

public class SjpAbstractMessengerReceiver implements SjpMessengerReceiver {
    @Override
    public void onEvent(String action, Object data) {

    }

    @Override
    public void onRequest(long id, String action, Object data) {

    }

    @Override
    public void onResponse(long id, Object data) {

    }

    @Override
    public void onError(Throwable ex) {

    }

    @Override
    public void onClose() {

    }
}
