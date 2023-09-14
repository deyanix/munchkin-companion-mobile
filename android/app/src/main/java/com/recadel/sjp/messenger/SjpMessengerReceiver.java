package com.recadel.sjp.messenger;

public interface SjpMessengerReceiver {
    void onEvent(String action, Object data);
    void onRequest(long id, String action, Object data);
    void onResponse(long id, Object data);
    void onError(Throwable ex);
    void onClose();
}
