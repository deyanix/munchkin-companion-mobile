package com.recadel.sjp.discovery;

import org.json.JSONException;

import java.io.IOException;
import java.net.DatagramSocket;
import java.net.SocketAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.concurrent.ScheduledExecutorService;

public class SjpDiscoveryServer extends SjpDiscoveryConnection {
	public SjpDiscoveryServer(ScheduledExecutorService executorService, SocketAddress address) throws SocketException {
		super(executorService, new DatagramSocket(address));
	}

	public SjpDiscoveryServer(ScheduledExecutorService executorService, int port) throws SocketException, UnknownHostException {
		super(executorService, new DatagramSocket(port));
	}

	public void start() {
		receive((address, message) -> {
			if (WELCOME_REQUEST_PATTERN.match(message) && message.getId() != null) {
				try {
					socket.send(WELCOME_RESPONSE_PATTERN
							.createMessage((long) message.getId())
							.toBuffer()
							.toDatagramPacket(address));
				} catch (IOException | JSONException ignored) {
				}
			}
		});
	}
}
