package com.recadel.sjp.reactnative;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.recadel.sjp.common.SjpMessageBuffer;
import com.recadel.sjp.exception.SjpException;
import com.recadel.sjp.reactnative.manager.SjpConnectionManager;
import com.recadel.sjp.reactnative.manager.SjpSocketManager;
import com.recadel.sjp.reactnative.service.SjpForegroundService;

import java.io.IOException;
import java.net.InetSocketAddress;

@ReactModule(name = SjpModule.NAME)
public class SjpModule extends ReactContextBaseJavaModule {
	public final static String NAME = "SjpModule";
	private final ReactApplicationContext reactContext;
	private final SjpRunner runner;

	public SjpModule(ReactApplicationContext reactContext) {
		this.reactContext = reactContext;
		this.runner = new SjpRunner(new SjpManager(), reactContext.getApplicationContext());
	}

	@NonNull
	@Override
	public String getName() {
		return NAME;
	}

	public Context getApplicationContext() {
		return reactContext.getApplicationContext();
	}

	public SjpRunner getRunner() {
		return runner;
	}

	public SjpManager getManager() {
		return runner.getManager();
	}

	@ReactMethod
	public void createDiscoveryServer(ReadableMap map, Callback callback) {
		try {
			int port = map.getInt("port");
			int id = getRequestedRunner(map).startDiscoveryServer(port);
			callback.invoke(id);
		} catch (IOException ex) {
			throw new SjpException("Error during creating discovery server", ex);
		}
	}

	@ReactMethod
	public void createDiscoveryClient(ReadableMap map, Callback callback) {
		try {
			String hostname = map.getString("address");
			int port = map.getInt("port");
			InetSocketAddress address = new InetSocketAddress(hostname, port);
			int id = getRequestedRunner(map).startDiscoveryClient(address);
			callback.invoke(id);
		} catch (IOException ex) {
			throw new SjpException("Error during creating discovery client", ex);
		}
	}

	@ReactMethod
	public void createSocket(ReadableMap map, Callback callback) {
		String address = map.getString("address");
		int port = map.getInt("port");
		getRequestedRunner(map).startSocket(callback::invoke, address, port);
	}

	@ReactMethod
	public void createServerSocket(ReadableMap map, Callback callback) {
		try {
			int port = map.getInt("port");
			int id = getRequestedRunner(map).startServerSocket(port);
			callback.invoke(id);
		} catch (IOException ex) {
			throw new SjpException("Error during socket server", ex);
		}
	}

	@ReactMethod
	public void write(int id, String encodedData) {
		SjpConnectionManager connection = runner.getManager().getConnection(id);
		if (!(connection instanceof SjpSocketManager)) {
			throw new SjpException(
					String.format("Socket with given id=%d isn't a TCP socket manager", id));
		}
		SjpSocketManager socketManager = (SjpSocketManager) connection;
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
		try {
			runner.getManager().close(id);
		} catch (IOException ex) {
			throw new SjpException(String.format("Error during closing socket id=%d", id), ex);
		}
	}

	@ReactMethod
	public void startBackgroundService() {
		Intent startIntent = new Intent(getApplicationContext(), SjpForegroundService.class)
				.setAction(SjpForegroundService.ACTION_START_SERVICE);
		getApplicationContext().startService(startIntent);
	}

	@ReactMethod
	public void stopBackgroundService() {
		Intent intent = new Intent(getApplicationContext(), SjpForegroundService.class);
		getApplicationContext().stopService(intent);
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

	private SjpRunner getRequestedRunner(ReadableMap map) {
		boolean background = false;
		if (map.hasKey("background")) {
			background = map.getBoolean("background");
		}
		Log.d("SJP", "Requested runner background = " + background);

//		SjpRunner backgroundRunner = getBackgroundRunner();
//		if (background && backgroundRunner != null) {
//			Log.d("SJP", "Use background runner");
//			return backgroundRunner;
//		}
		Log.d("SJP", "Use synchronous runner");
		return runner;
	}
}
