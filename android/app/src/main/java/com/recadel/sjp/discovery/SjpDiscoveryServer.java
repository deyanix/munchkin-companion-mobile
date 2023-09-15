package com.recadel.sjp.discovery;

import org.json.JSONException;

import java.io.IOException;
import java.net.DatagramSocket;
import java.net.SocketAddress;
import java.net.SocketException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

public class SjpDiscoveryServer extends SjpDiscoveryConnection {
	private ScheduledExecutorService executorService;

	public SjpDiscoveryServer(SocketAddress address) throws SocketException {
		super(new DatagramSocket(address));
	}

	public SjpDiscoveryServer(int port) throws SocketException {
		super(new DatagramSocket(port));
	}

	public void start() {
		executorService = Executors.newScheduledThreadPool(2);
		receive((address, message) -> {
			if (welcomeRequestPattern.shallowMatch(message) && message.getId() != null) {
				try {
					socket.send(welcomeResponsePattern
							.createMessage((long) message.getId())
							.toBuffer()
							.toDatagramPacket(address));
				} catch (IOException | JSONException ignored) {
				}
			}
		}, executorService);
	}

	@Override
	public void close() {
		super.close();
		if (executorService != null) {
			executorService.shutdown();
		}
	}
}
