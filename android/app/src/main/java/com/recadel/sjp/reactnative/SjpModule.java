package com.recadel.sjp.reactnative;

import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.WorkRequest;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.recadel.sjp.common.SjpMessageBuffer;
import com.recadel.sjp.common.SjpReceiverGarbageCollector;
import com.recadel.sjp.discovery.SjpDiscoveryClient;
import com.recadel.sjp.discovery.SjpDiscoveryServer;
import com.recadel.sjp.exception.SjpException;
import com.recadel.sjp.reactnative.manager.SjpDiscoveryClientManager;
import com.recadel.sjp.reactnative.manager.SjpDiscoveryServerManager;
import com.recadel.sjp.reactnative.manager.SjpSocketManager;
import com.recadel.sjp.reactnative.manager.SjpModuleManager;
import com.recadel.sjp.reactnative.manager.SjpSocketServerManager;
import com.recadel.sjp.reactnative.worker.SjpSocketServerWorker;
import com.recadel.sjp.socket.SjpSocket;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

@ReactModule(name = SjpModule.NAME)
public class SjpModule extends ReactContextBaseJavaModule {
	public final static String NAME = "SjpModule";
	private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(64);
	private final Map<Integer, SjpModuleManager> sockets = new HashMap<>();
	private final ReactApplicationContext reactContext;
	private final SjpReceiverGarbageCollector garbageCollector = new SjpReceiverGarbageCollector(executorService);
	private int nextSocketId = 1;

	public SjpModule(ReactApplicationContext reactContext) {
		this.reactContext = reactContext;
	}

	@NonNull
	@Override
	public String getName() {
		return NAME;
	}

	public ScheduledExecutorService getExecutorService() {
		return executorService;
	}

	public ReactApplicationContext getReactContext() {
		return reactContext;
	}

	public int allocateSocketId() {
		return nextSocketId++;
	}

	public void addManager(SjpModuleManager manager) {
		sockets.put(manager.getId(), manager);
	}

	@ReactMethod
	public void createDiscoveryServer(ReadableMap map, Callback callback) {
		try {
			int id = allocateSocketId();
			SjpDiscoveryServer server = new SjpDiscoveryServer(executorService, map.getInt("port"));
			SjpDiscoveryServerManager manager = new SjpDiscoveryServerManager(id, this, server);
			manager.start();
			addManager(manager);
			callback.invoke(id);
		} catch (IOException ex) {
			throw new SjpException("Error during creating discovery server", ex);
		}
	}

	@ReactMethod
	public void createDiscoveryClient(ReadableMap map, Callback callback) {
		try {
			int id = allocateSocketId();
			SjpDiscoveryClient client = new SjpDiscoveryClient(executorService);
			SjpDiscoveryClientManager manager = new SjpDiscoveryClientManager(id, this, client);

			manager.start(new InetSocketAddress(
					map.getString("address"),
					map.getInt("port")));

			addManager(manager);
			callback.invoke(id);
		} catch (IOException ex) {
			throw new SjpException("Error during creating discovery client", ex);
		}
	}

	@ReactMethod
	public void createSocket(ReadableMap map, Callback callback) {
		int id = allocateSocketId();
		executorService.submit(() -> {
			try {
				SjpSocket socket = new SjpSocket(
						new Socket(map.getString("address"), map.getInt("port")));
				socket.applyGarbageCollector(garbageCollector);
				garbageCollector.start();

				SjpSocketManager manager = new SjpSocketManager(id, this, socket);
				addManager(manager);
				callback.invoke(id);
			} catch (IOException ex) {
				throw new SjpException("Error during creating socket client", ex);
			}
		});
	}

	@ReactMethod
	public void createServerSocket(ReadableMap map, Callback callback) {
		try {
			int id = allocateSocketId();
			ServerSocket socket = new ServerSocket(map.getInt("port"));
			SjpSocketServerManager manager = new SjpSocketServerManager(id, this, socket, garbageCollector);
			manager.start();
			garbageCollector.start();

			addManager(manager);
			callback.invoke(id);
		} catch (IOException ex) {
			throw new SjpException("Error during socket server", ex);
		}
	}

	@ReactMethod
	public void write(int id, String encodedData) {
		SjpModuleManager manager = sockets.get(id);
		if (!(manager instanceof SjpSocketManager)) {
			throw new SjpException(
					String.format("Socket with given id=%d isn't a TCP socket manager", id));
		}
		SjpSocketManager socketManager = (SjpSocketManager) manager;
		byte[] data = Base64.decode(encodedData, Base64.NO_WRAP);
		try {
			socketManager
					.getSocket()
					.send(new SjpMessageBuffer(data).append(SjpMessageBuffer.END_OF_MESSAGE));
		} catch (IOException ex) {
			throw new SjpException(
					String.format("Error during sending data via socket id=%d", id), ex);
		}
	}

	@ReactMethod
	public void close(Integer id) {
		if (!sockets.containsKey(id)) {
			throw new SjpException(
					String.format("Socket with given id=%d not exists", id));
		}

		try {
			sockets.get(id).close();
			sockets.remove(id);
		} catch (IOException ex) {
			throw new SjpException(String.format("Error during closing socket id=%d", id), ex);
		}
	}

	@ReactMethod
	public void download(String url) {
		Constraints constraints = new Constraints.Builder()
				.setRequiredNetworkType(NetworkType.CONNECTED)
				.build();
		Data data = new Data.Builder()
				.putString(SjpSocketServerWorker.KEY_INPUT_URL, url)
				.build();

		OneTimeWorkRequest workRequest = new OneTimeWorkRequest.Builder(SjpSocketServerWorker.class)
				.setInputData(data)
				.setConstraints(constraints)
				.build();
		WorkManager
				.getInstance(getReactContext().getApplicationContext())
				.enqueue(workRequest);
	}

	@SuppressWarnings("unused")
	@ReactMethod
	public void addListener(String eventName) {
		// Keep: Required for RN built in Event Emitter Calls.
	}

	@SuppressWarnings("unused")
	@ReactMethod
	public void removeListeners(Integer count) {
		// Keep: Required for RN built in Event Emitter Calls.
	}
}
