package com.recadel.sjp.reactnative.manager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.reactnative.SjpRunner;

import java.io.Closeable;
import java.util.concurrent.ScheduledExecutorService;

public abstract class SjpConnectionManager implements Closeable {
	private final int id;
	private final SjpRunner runner;

	public SjpConnectionManager(int id, SjpRunner runner) {
		this.id = id;
		this.runner = runner;
	}

	public int getId() {
		return id;
	}

	public SjpRunner getRunner() {
		return runner;
	}

	protected WritableMap createEventMap() {
		WritableMap map = Arguments.createMap();
		map.putInt("socketId", getId());
		return map;
	}

	protected void emitEvent(String name) {
		getRunner().emitEvent(name, createEventMap());
	}

	protected void emitEvent(String name, WritableMap map) {
		getRunner().emitEvent(name, map);
	}

	public abstract void start(ScheduledExecutorService executorService);
}
