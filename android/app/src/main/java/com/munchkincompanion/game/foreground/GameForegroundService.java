package com.munchkincompanion.game.foreground;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.NonNull;

import com.munchkincompanion.R;

public class GameForegroundService extends Service {
    public static final String ACTION_START_SERVICE = "START";
    public static final String ACTION_STOP_SERVICE = "STOP";
    public static final int NOTIFICATION_ID = 10304;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("Munchkin-Foreground", "Start command");
        if (intent != null) {
            if (ACTION_START_SERVICE.equals(intent.getAction())) {
                Log.d("Munchkin-Foreground", "Started service");
                startForeground(NOTIFICATION_ID, createNotification());
            } else if (ACTION_STOP_SERVICE.equals(intent.getAction())) {
                Log.d("Munchkin-Foreground", "Requested stop service");
                stopSelf();
            }
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        Log.d("Munchkin-Foreground", "Destroy service");
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        Log.d("Munchkin-Foreground", "Bind service");
        return null;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        Log.d("Munchkin-Foreground", "Unbind service");
        return super.onUnbind(intent);
    }

    @NonNull
    private Notification createNotification() {
        Intent intent = new Intent(this, GameForegroundService.class)
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
}