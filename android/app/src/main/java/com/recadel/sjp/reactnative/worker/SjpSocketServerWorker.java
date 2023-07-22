package com.recadel.sjp.reactnative.worker;

import static android.content.Context.NOTIFICATION_SERVICE;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationChannelGroup;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.work.Data;
import androidx.work.ForegroundInfo;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.munchkincompanion.R;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class SjpSocketServerWorker extends Worker {
    public static final int NOTIFICATION_ID = 10304;
    public static final String KEY_INPUT_URL = "KEY_INPUT_URL";
    private static final String TAG = "Sjp";
    private final NotificationManager notificationManager;

    public SjpSocketServerWorker(Context context, WorkerParameters parameters) {
        super(context, parameters);
        notificationManager = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
    }

    @NonNull
    @Override
    public Result doWork() {
        Data inputData = getInputData();
        String inputUrl = inputData.getString(KEY_INPUT_URL);

        String progress = "Starting Download";
        setForegroundAsync(createForegroundInfo(progress));
        download(inputUrl);
        return Result.success();
    }

    private void download(String inputUrl) {
        try {
            URL url = new URL(inputUrl);
            HttpURLConnection httpConnection = (HttpURLConnection) (url.openConnection());
            long fileLength;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                fileLength = httpConnection.getContentLengthLong();
            } else {
                fileLength = httpConnection.getContentLength();
            }

            BufferedInputStream in = new BufferedInputStream(new URL(inputUrl).openStream());
            byte[] dataBuffer = new byte[1024];
            long downloadedLength = 0;
            int bytesRead;
            double lastStatus = 0;
            while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
                downloadedLength += bytesRead;
                final double currentProgress = Math.round((((double) downloadedLength) / ((double) fileLength)) * 10000d) / 100d;

                if (currentProgress != lastStatus) {
                    setForegroundAsync(createForegroundInfo(String.format("Downloading %.2f%%", currentProgress)));
                    lastStatus = currentProgress;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @NonNull
    private ForegroundInfo createForegroundInfo(@NonNull String progress) {
        Context context = getApplicationContext();
        String id = "munchkin-companion";
        String title = "Munchkin Companion";
        String cancel = "Cancel";

        PendingIntent intent = WorkManager.getInstance(context)
                .createCancelPendingIntent(getId());

        Notification notification = new NotificationCompat.Builder(context, id)
                .setContentTitle(title)
                .setTicker(title)
                .setContentText(progress)
                .setVisibility(NotificationCompat.VISIBILITY_SECRET)
                .setSmallIcon(R.drawable.ic_notification)
                .setOngoing(true)
                .addAction(android.R.drawable.ic_delete, cancel, intent)
                .build();

        return new ForegroundInfo(NOTIFICATION_ID, notification);
    }
}