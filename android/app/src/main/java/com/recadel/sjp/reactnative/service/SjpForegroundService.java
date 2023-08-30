package com.recadel.sjp.reactnative.service;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.munchkincompanion.MainApplication;
import com.munchkincompanion.R;
import com.recadel.sjp.reactnative.SjpModule;
import com.recadel.sjp.reactnative.SjpRunner;

public class SjpForegroundService extends HeadlessJsTaskService {
    public static final String ACTION_START_SERVICE = "START";
    public static final String ACTION_STOP_SERVICE = "STOP";
    public static final int NOTIFICATION_ID = 10304;
    private SjpRunner runner;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("SJP", "Created command");
    }

//    @Override
//    public int onStartCommand(Intent intent, int flags, int startId) {
//        Log.d("SJP", "Start command");
//        if (intent != null) {
//            if (ACTION_START_SERVICE.equals(intent.getAction())) {
//                Log.d("SJP", "Started service");
//
//                SjpModule module = ((MainApplication) getApplicationContext())
//                        .getReactNativeHost()
//                        .getReactInstanceManager()
//                        .getCurrentReactContext()
//                        .getNativeModule(SjpModule.class);
//                runner = new SjpRunner(module.getManager(), getApplicationContext());
//            } else if (ACTION_STOP_SERVICE.equals(intent.getAction())) {
//                Log.d("SJP", "Requested stop service");
//                runner.emitEvent("background-cancel", null);
//            }
//        }
//        return START_NOT_STICKY;
//    }

    @Override
    public void onDestroy() {
        Log.d("SJP", "Destroy service");
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        super.onBind(intent);
        Log.d("SJP", "Bind service");
        return null;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        Log.d("SJP", "Unbind service");
        return super.onUnbind(intent);
    }

    @NonNull
    private Notification createNotification() {
        Intent intent = new Intent(this, SjpForegroundService.class)
                .setAction(ACTION_STOP_SERVICE);
        PendingIntent pendingIntent = PendingIntent.getService(this, 0, intent,
                PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        String title = "Udostępnianie pokoju";
        return new NotificationCompat.Builder(this, "munchkin-companion")
                .setContentTitle(title)
                .setTicker(title)
                .setContentText("Jesteś właścicielem pokoju.")
                .setVisibility(NotificationCompat.VISIBILITY_SECRET)
                .setSmallIcon(R.drawable.ic_notification)
                .setOngoing(true)
                .addAction(android.R.drawable.ic_delete, "Zakończ", pendingIntent)
                .build();
    }

    public HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            startForeground(NOTIFICATION_ID, createNotification());
            return new HeadlessJsTaskConfig(
                    "SomeTaskName",
                    Arguments.fromBundle(extras),
                    0L,
                    true
            );
        }
        return null;
    }
}
