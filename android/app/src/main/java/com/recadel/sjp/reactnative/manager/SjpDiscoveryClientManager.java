package com.recadel.sjp.reactnative.manager;

import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.discovery.SjpDiscoveryClient;
import com.recadel.sjp.reactnative.SjpRunner;

import java.util.concurrent.ScheduledExecutorService;

public class SjpDiscoveryClientManager extends SjpConnectionManager {
	private final SjpDiscoveryClient client;

	public SjpDiscoveryClientManager(int id, SjpRunner runner, SjpDiscoveryClient client) {
		super(id, runner);
		this.client = client;
	}

	@Override
	public void start(ScheduledExecutorService executorService) {
		client.discover((address) -> {
			WritableMap map = createEventMap();
			map.putString("address", address.getAddress().getHostAddress());
			map.putInt("port", address.getPort());;
			emitEvent("discover", map);
		}, executorService);
	}

	@Override
	public void close() {
		client.close();
	}
}
