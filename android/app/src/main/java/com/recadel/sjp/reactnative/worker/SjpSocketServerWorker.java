package com.recadel.sjp.reactnative.worker;

import static android.content.Context.NOTIFICATION_SERVICE;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.os.Handler;

import androidx.annotation.NonNull;
import androidx.concurrent.futures.CallbackToFutureAdapter;
import androidx.core.app.NotificationCompat;
import androidx.work.Data;
import androidx.work.ForegroundInfo;
import androidx.work.ListenableWorker;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.google.common.util.concurrent.ListenableFuture;
import com.munchkincompanion.MainApplication;
import com.munchkincompanion.R;
import com.recadel.sjp.reactnative.SjpModule;
import com.recadel.sjp.reactnative.manager.SjpSocketServerManager;

import java.io.IOException;
import java.net.ServerSocket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class SjpSocketServerWorker extends ListenableWorker {
    public static final int NOTIFICATION_ID = 10304;
    public static final String KEY_SOCKET_ID = "KEY_SOCKET_ID";
    public static final String KEY_PORT = "KEY_PORT";
    private final NotificationManager notificationManager;
    private final SjpModule module;

    public SjpSocketServerWorker(Context context, WorkerParameters parameters) {
        super(context, parameters);
        notificationManager = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
        module = ((MainApplication) getApplicationContext())
                .getReactNativeHost()
                .getReactInstanceManager()
                .getCurrentReactContext()
                .getNativeModule(SjpModule.class);
    }

    @NonNull
    @Override
    public ListenableFuture<Result> startWork() {setForegroundAsync(createForegroundInfo());
        Data data = getInputData();
        int socketId = data.getInt(KEY_SOCKET_ID, -1);
        int port = data.getInt(KEY_PORT, -1);

        return CallbackToFutureAdapter.getFuture(completer -> {
            try {
                ScheduledExecutorService executorService = Executors.newScheduledThreadPool(16);
                ServerSocket socket = new ServerSocket(port);
                SjpSocketServerManager manager = new SjpSocketServerManager(socketId, module, executorService, socket);
                manager.start();
                module.addManager(manager);

                completer.addCancellationListener(() -> {
                    try {
                        manager.close();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }, executorService);
            } catch (IOException ex) {
                ex.printStackTrace();
                return Result.failure();
            }
            return true;
        });
    }

    @NonNull
    private ForegroundInfo createForegroundInfo() {
        Context context = getApplicationContext();
        PendingIntent intent = WorkManager.getInstance(context)
                .createCancelPendingIntent(getId());

        String title = "Udostępnianie pokoju";
        Notification notification = new NotificationCompat.Builder(context, "munchkin-companion")
                .setContentTitle(title)
                .setTicker(title)
                .setContentText("Jesteś właścicielem pokoju.")
                .setVisibility(NotificationCompat.VISIBILITY_SECRET)
                .setSmallIcon(R.drawable.ic_notification)
                .setOngoing(true)
                .addAction(android.R.drawable.ic_delete, "Zakończ", intent)
                .build();

        return new ForegroundInfo(NOTIFICATION_ID, notification);
    }
}