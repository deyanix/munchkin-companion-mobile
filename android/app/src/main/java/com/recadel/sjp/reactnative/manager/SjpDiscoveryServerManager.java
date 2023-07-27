package com.recadel.sjp.reactnative.manager;

import com.recadel.sjp.discovery.SjpDiscoveryServer;
import com.recadel.sjp.reactnative.SjpRunner;

import java.util.concurrent.ScheduledExecutorService;

public class SjpDiscoveryServerManager extends SjpConnectionManager {
	private final SjpDiscoveryServer server;

	public SjpDiscoveryServerManager(int id, SjpRunner runner, SjpDiscoveryServer server) {
		super(id, runner);
		this.server = server;
	}

	@Override
	public void start(ScheduledExecutorService executorService) {
		server.start(executorService);
	}

	@Override
	public void close() {
		server.close();
	}
}
