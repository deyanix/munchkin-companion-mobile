package com.munchkincompanion.game.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class ReactEventEmitter {
    private final ReactContext reactContext;

    public ReactEventEmitter(ReactContext reactContext) {
        this.reactContext = reactContext;
    }

    public DeviceEventManagerModule.RCTDeviceEventEmitter getNativeEmitter() {
        return reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    public void emit(String action, Object obj) {
        getNativeEmitter().emit(action, obj);
    }

    public void emit(String action) {
        emit(action, null);
    }
}
