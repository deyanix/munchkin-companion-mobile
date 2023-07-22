package com.recadel.sjp.reactnative.manager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.recadel.sjp.reactnative.SjpModule;

import java.io.Closeable;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ScheduledExecutorService;

public abstract class SjpModuleManager implements Closeable {
	private final int id;
	private final SjpModule module;
	private final ScheduledExecutorService executorService;

	public SjpModuleManager(int id, SjpModule module, ScheduledExecutorService executorService) {
		this.id = id;
		this.module = module;
		this.executorService = executorService;
	}

	public SjpModuleManager(int id, SjpModule module) {
		this(id, module, null);
	}

	public int getId() {
		return id;
	}

	public ReactApplicationContext getReactContext() {
		return module.getReactContext();
	}

	public ScheduledExecutorService getExecutorService() {
		if (executorService != null) {
			return executorService;
		}
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

	protected void emitEvent(String name) {
		emitEvent(name, createMap());
	}

	@Override
	public abstract void close() throws IOException;
}
