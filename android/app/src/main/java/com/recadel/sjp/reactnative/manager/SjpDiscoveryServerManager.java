package com.recadel.sjp.reactnative.manager;

import com.recadel.sjp.discovery.SjpDiscoveryServer;
import com.recadel.sjp.reactnative.SjpModule;

import java.io.IOException;

public class SjpDiscoveryServerManager extends SjpModuleManager {
	private final SjpDiscoveryServer server;

	public SjpDiscoveryServerManager(int id, SjpModule module, SjpDiscoveryServer server) {
		super(id, module);
		this.server = server;
	}

	public void start() {
		server.start();
	}

	@Override
	public void close() {
		server.close();
	}
}
