package com.recadel.sjp.reactnative.manager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.recadel.sjp.reactnative.SjpModule;

import java.io.Closeable;
import java.io.IOException;
import java.util.concurrent.ScheduledExecutorService;

public abstract class SjpModuleManager implements Closeable {
	private final int id;
	private final SjpModule module;

	public SjpModuleManager(int id, SjpModule module) {
		this.id = id;
		this.module = module;
	}

	public int getId() {
		return id;
	}

	public ReactApplicationContext getReactContext() {
		return module.getReactContext();
	}

	public ScheduledExecutorService getExecutorService() {
		return module.getExecutorService();
	}

	public SjpModule getModule() {
		return module;
	}

	protected WritableMap createMap() {
		WritableMap map = Arguments.createMap();
		map.putInt("socketId", getId());
		return map;
	}

	protected void emitEvent(String name, Object data) {
		getReactContext()
				.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
				.emit(name, data);
	}

	@Override
	public abstract void close() throws IOException;
}
