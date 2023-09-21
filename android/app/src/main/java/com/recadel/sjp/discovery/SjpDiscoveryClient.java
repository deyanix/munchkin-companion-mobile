package com.recadel.sjp.discovery;

import com.recadel.sjp.common.SjpMessage;

import org.json.JSONException;

import java.io.IOException;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.net.SocketException;
import java.util.Queue;
import java.util.Random;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;

public class SjpDiscoveryClient extends SjpDiscoveryConnection {
	private final SocketAddress broadcastAddress;
	private int identifiersPool = 10;
	private long interval;
	private ScheduledFuture<?> senderFuture;
	private ScheduledExecutorService executorService;

	public SjpDiscoveryClient(SocketAddress broadcastAddress) throws SocketException {
		super(new DatagramSocket());
		this.broadcastAddress = broadcastAddress;
		this.interval = getReceiverLifetime() / 2;
	}

	public void discover(BiConsumer<InetSocketAddress, SjpMessage> consumer) {
		executorService = Executors.newScheduledThreadPool(2);

		final int localIdentifiersPool = identifiersPool;
		Random random = new Random();
		Queue<Long> requestIds = new ConcurrentLinkedQueue<>();

		receive((address, message) -> {
			if (address instanceof InetSocketAddress &&
					welcomeResponsePattern.shallowMatch(message) &&
					requestIds.contains(message.getId())) {
				consumer.accept((InetSocketAddress) address, message);
			}
		}, executorService);

		senderFuture = executorService.scheduleAtFixedRate(() -> {
			try {
				long id = random.nextLong();
				socket.send(welcomeRequestPattern.createMessage(id).toBuffer().toDatagramPacket(broadcastAddress));
				requestIds.add(id);
				if (requestIds.size() > localIdentifiersPool) {
					requestIds.poll();
				}
			} catch (IOException | JSONException ignored) {
			}
		}, 0, interval, TimeUnit.MILLISECONDS);
	}

	public void close() {
		super.close();
		senderFuture.cancel(false);
		if (executorService != null) {
			executorService.shutdown();
		}
	}

	public int getIdentifiersPool() {
		return identifiersPool;
	}

	public void setIdentifiersPool(int identifiersPool) {
		this.identifiersPool = identifiersPool;
	}

	public long getInterval() {
		return interval;
	}

	public void setInterval(long interval) {
		this.interval = interval;
	}
}
