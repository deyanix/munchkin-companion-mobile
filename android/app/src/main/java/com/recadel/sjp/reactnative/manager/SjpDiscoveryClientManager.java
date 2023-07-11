package com.recadel.sjp.reactnative.manager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.discovery.SjpDiscoveryClient;
import com.recadel.sjp.reactnative.SjpModule;

import java.net.SocketAddress;

public class SjpDiscoveryClientManager extends SjpModuleManager {
	private final SjpDiscoveryClient client;

	public SjpDiscoveryClientManager(int id, SjpModule module, SjpDiscoveryClient client) {
		super(id, module);
		this.client = client;
	}

	public void start(SocketAddress broadcastAddress) {
		client.discover((address) -> {
			WritableMap map = createMap();
			map.putString("address", address.getAddress().getHostAddress());
			map.putInt("port", address.getPort());;
			emitEvent("discover", map);
		}, broadcastAddress);
	}

	@Override
	public void close() {
		client.close();
	}
}
