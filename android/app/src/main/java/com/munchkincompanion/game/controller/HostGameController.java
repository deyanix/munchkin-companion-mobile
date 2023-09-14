package com.munchkincompanion.game.controller;

import com.munchkincompanion.game.entity.Device;
import com.munchkincompanion.game.entity.Player;
import com.munchkincompanion.game.entity.PlayerData;
import com.munchkincompanion.game.exception.GameException;
import com.munchkincompanion.game.reactnative.ReactEventEmitter;
import com.recadel.sjp.discovery.SjpDiscoveryServer;
import com.recadel.sjp.messenger.SjpMessenger;
import com.recadel.sjp.messenger.SjpMessengerReceiver;
import com.recadel.sjp.messenger.SjpServerMediator;
import com.recadel.sjp.messenger.SjpServerMessengerListener;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

public class HostGameController extends LocalGameController {
    private final SjpDiscoveryServer discoveryServer;
    private final SjpServerMediator mediator;

    public HostGameController(ReactEventEmitter eventEmitter, SjpDiscoveryServer discoveryServer, SjpServerMediator mediator) {
        super(eventEmitter);
        this.discoveryServer = discoveryServer;
        this.mediator = mediator;
        mediator.addListener(new HostGameServerMessengerListener());
    }

    @Override
    public void createPlayer(PlayerData data) {
        Player player = createLocallyPlayer(data);
            mediator.broadcast("players/create", player.toJSON());

    }

    @Override
    public void updatePlayer(Player player) {
        updateLocallyPlayer(player);
            mediator.broadcast("players/update", player.toJSON());

    }

    @Override
    public void deletePlayer(int playerId) {
        deleteLocallyPlayer(playerId);
        mediator.broadcast("players/delete", playerId);
    }

    private JSONArray getJSONPlayers() {
        try {
            return new JSONArray(getPlayers().stream().map(Player::toJSON).toArray());
        } catch (JSONException e) {
            throw new GameException(e);
        }
    }

    @Override
    public void close() throws IOException {
        discoveryServer.close();
        mediator.close();
    }

    class HostGameServerMessengerListener implements SjpServerMessengerListener {
        @Override
        public void onConnect(SjpMessenger messenger) {
            messenger.addReceiver(new HostGameMessengerReceiver(messenger));
            messenger.emit("welcome", Device.getCurrent());
        }

        @Override
        public void onClose() {
        }

        @Override
        public void onError(Throwable ex) {
			ex.printStackTrace();
        }
    }

    class HostGameMessengerReceiver implements SjpMessengerReceiver {
        final SjpMessenger messenger;

        HostGameMessengerReceiver(SjpMessenger messenger) {
            this.messenger = messenger;
        }

        @Override
        public void onEvent(String action, Object data) {
			switch (action) {
                case "players/create":
					assert data instanceof JSONObject;
					Player player = createLocallyPlayer(PlayerData.fromJSON((JSONObject) data));
					mediator.broadcast("players/create", player);
				    break;
                case "players/update":
                    assert data instanceof JSONObject;
					updateLocallyPlayer(Player.fromJSON((JSONObject) data));
					mediator.broadcast("players/update", data);
                    break;
                case "players/delete":
                    assert data instanceof Integer;
					deleteLocallyPlayer((Integer) data);
					mediator.broadcast("players/delete", data);
                    break;
                case "players/get":
					messenger.emit("players/synchronize", getJSONPlayers());
                    break;
			}
        }

        @Override
        public void onRequest(long id, String action, Object data) {
            switch (action) {
                case "welcome":
                    messenger.response(id, Device.getCurrent().toJSON());
                    break;
            }
        }

        @Override
        public void onResponse(long id, Object data) {

        }

        @Override
		public void onError(Throwable ex) {
			ex.printStackTrace();
		}

		@Override
		public void onClose() {
		}
	}
}
