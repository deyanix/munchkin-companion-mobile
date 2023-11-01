package eu.deyanix.munchkincompanion.game.reactnative;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.module.annotations.ReactModule;
import eu.deyanix.munchkincompanion.game.controller.GameController;
import eu.deyanix.munchkincompanion.game.controller.GuestGameController;
import eu.deyanix.munchkincompanion.game.controller.HostGameController;
import eu.deyanix.munchkincompanion.game.entity.Device;
import eu.deyanix.munchkincompanion.game.entity.Player;
import eu.deyanix.munchkincompanion.game.entity.PlayerData;
import eu.deyanix.munchkincompanion.game.finder.GameFinder;
import eu.deyanix.munchkincompanion.game.foreground.GameForegroundService;
import com.recadel.sjp.common.SjpReceiverGarbageCollector;
import com.recadel.sjp.discovery.SjpDiscoveryServer;
import com.recadel.sjp.messenger.SjpMessenger;
import com.recadel.sjp.messenger.SjpServerMediator;
import com.recadel.sjp.socket.SjpSocket;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.SocketException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@ReactModule(name = GameModule.NAME)
public class GameModule extends ReactContextBaseJavaModule {
    public final static String NAME = "GameModule";
    private final ReactApplicationContext reactContext;
    private final ReactEventEmitter eventEmitter;
    private final SjpReceiverGarbageCollector garbageCollector = new SjpReceiverGarbageCollector();
    private GameController gameController;
    private GameFinder gameFinder;

    public GameModule(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        this.eventEmitter = new ReactEventEmitter(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void startDiscovery(ReadableMap map) {
        Log.d("Munchkin-Game", "Start a discovery server");
        String address = map.getString("address");
        int port = map.getInt("port");
        SocketAddress socketAddress = new InetSocketAddress(address, port);
        try {
            gameFinder = new GameFinder(socketAddress, eventEmitter);
            gameFinder.start();
        } catch (SocketException e) {
            e.printStackTrace();
            this.eventEmitter.emit("error", e.getMessage());
        }
    }

    @ReactMethod
    public void closeDiscovery() {
        Log.d("Munchkin-Game", "Close a discovery server");
        if (gameFinder != null) {
            gameFinder.close();
        }
        gameFinder = null;
    }

    @ReactMethod
    public void startHostGame(ReadableMap map, Callback callback) {
        Log.d("Munchkin-Game", "Start a host game");
        int port = map.getInt("port");
        try {
            Context context = reactContext.getApplicationContext();
            Intent intent = new Intent(context, GameForegroundService.class)
                    .setAction(GameForegroundService.ACTION_START_SERVICE);
            context.startService(intent);

            SjpDiscoveryServer discoveryServer = new SjpDiscoveryServer(port);
            discoveryServer.setWelcomeRequestPattern(GameFinder.WELCOME_REQUEST_PATTERN);
            discoveryServer.setWelcomeResponsePattern(
                    GameFinder.WELCOME_RESPONSE_PATTERN.withData(Device.getCurrent().toJSON()));
            discoveryServer.start();

            ServerSocket serverSocket = new ServerSocket(port);
            SjpServerMediator mediator = new SjpServerMediator(serverSocket);
            mediator.setGarbageCollector(garbageCollector);
            mediator.start();

            gameController = new HostGameController(eventEmitter, discoveryServer, mediator);
            callback.invoke();
        } catch (IOException e) {
            e.printStackTrace();
            this.eventEmitter.emit("error", e.getMessage());
            callback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void startGuestGame(ReadableMap map, Callback callback) {
        Log.d("Munchkin-Game", "Start a guest game");
        String address = map.getString("address");
        int port = map.getInt("port");
        try {
            Socket socket = new Socket(address, port);
            SjpSocket sjpSocket = new SjpSocket(socket);
            sjpSocket.applyGarbageCollector(garbageCollector);
            sjpSocket.setup();
            SjpMessenger messenger = new SjpMessenger(sjpSocket);
            GuestGameController gameController = new GuestGameController(eventEmitter, messenger);
            gameController.synchronizePlayers();

            this.gameController = gameController;
            callback.invoke();
        } catch (IOException e) {
            e.printStackTrace();
            this.eventEmitter.emit("error", e.getMessage());
            callback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void closeGame(Callback callback) {
        Log.d("Munchkin-Game", "Close a game");
        if (gameController == null) {
            return;
        }

        try {
            Context context = reactContext.getApplicationContext();
            Intent intent = new Intent(context, GameForegroundService.class)
                    .setAction(GameForegroundService.ACTION_STOP_SERVICE);
            context.stopService(intent);

            gameController.close();
            callback.invoke();
        } catch (IOException e) {
            this.eventEmitter.emit("error", e.getMessage());
            callback.invoke(e.getMessage());
        }
        gameController = null;
    }

    @ReactMethod
    public void setPlayers(ReadableArray array) {
        if (gameController != null) {
            List<Player> players = IntStream.range(0, array.size())
                    .mapToObj(array::getMap)
                    .map(Player::fromMap)
                    .collect(Collectors.toList());

            gameController.setPlayers(players);
        }
    }

    @ReactMethod
    public void getPlayers(Callback callback) {
        Log.d("Munchkin-Game", "Get players");
        if (gameController == null) {
            callback.invoke();
        } else {
            WritableArray array = Arguments.createArray();
            gameController.getPlayers()
                    .stream()
                    .map(Player::toMap)
                    .forEach(array::pushMap);

            callback.invoke(array);
        }
    }

    @ReactMethod
    public void getControllerType(Callback callback) {
        Log.d("Munchkin-Game", "Get controller type");
        if (gameController == null) {
            callback.invoke();
        } else {
            callback.invoke(gameController.getName());
        }
    }

    @ReactMethod
    public void createPlayer(ReadableMap map) {
        Log.d("Munchkin-Game", "Create player");
        if (gameController == null) {
            return;
        }
        gameController.createPlayer(PlayerData.fromMap(map));
    }

    @ReactMethod
    public void updatePlayer(ReadableMap map) {
        Log.d("Munchkin-Game", "Update player");
        if (gameController == null) {
            return;
        }
        gameController.updatePlayer(Player.fromMap(map));
    }

    @ReactMethod
    public void deletePlayer(int playerId) {
        Log.d("Munchkin-Game", "Delete player");
        if (gameController == null) {
            return;
        }
        gameController.deletePlayer(playerId);
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
