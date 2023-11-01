package eu.deyanix.munchkincompanion.game.controller;

import android.util.Log;

import eu.deyanix.munchkincompanion.game.entity.Player;
import eu.deyanix.munchkincompanion.game.entity.PlayerData;
import eu.deyanix.munchkincompanion.game.exception.GameException;
import eu.deyanix.munchkincompanion.game.reactnative.ReactEventEmitter;
import com.recadel.sjp.messenger.SjpMessenger;
import com.recadel.sjp.messenger.SjpMessengerReceiver;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class GuestGameController extends GameController {
	private final SjpMessenger messenger;

	public GuestGameController(ReactEventEmitter eventEmitter, SjpMessenger messenger) {
		super(eventEmitter);
		this.messenger = messenger;
		messenger.addReceiver(new GuestGameReceiver());
	}

	public void synchronizePlayers() {
		messenger.emit("players/get");
	}

	@Override
	public void createPlayer(PlayerData data) {
		messenger.emit("players/create", data.toJSON());
	}

	@Override
	public void updatePlayer(Player player) {
		messenger.emit("players/update", player.toJSON());
	}

	@Override
	public void deletePlayer(int playerId) {
		messenger.emit("players/delete", playerId);
	}

	@Override
	public String getName() {
		return "GUEST";
	}

	private void replaceJSONPlayers(JSONArray array) {
		replacePlayers(fromJSONPlayers(array));
	}

	private List<Player> fromJSONPlayers(JSONArray array) {
		return IntStream.range(0, array.length())
				.mapToObj(index -> fromJSON(array, index))
				.collect(Collectors.toList());
	}

	private Player fromJSON(JSONArray array, int index) {
		try {
			return Player.fromJSON(array.getJSONObject(index));
		} catch (JSONException e) {
			throw new GameException(e);
		}
	}

	public void close() throws IOException {
		messenger.getSocket().close();
	}

	class GuestGameReceiver implements SjpMessengerReceiver {
		@Override
		public void onEvent(String action, Object data) {
			Log.d("MunchkinCompanion-Guest",
					String.format("Received event (action: %s, data: %s)", action, data));
			switch (action) {
				case "players/create":
					assert data instanceof JSONObject;
					appendLocallyPlayer(Player.fromJSON((JSONObject) data));
					break;
				case "players/update":
					assert data instanceof JSONObject;
					updateLocallyPlayer(Player.fromJSON((JSONObject) data));
					break;
				case "players/delete":
					assert data instanceof Integer;
					deleteLocallyPlayer((Integer) data);
					break;
				case "players/synchronize":
					assert data instanceof JSONArray;
					replaceJSONPlayers((JSONArray) data);
					break;
			}
		}

		@Override
		public void onRequest(long id, String action, Object data) {
			Log.d("MunchkinCompanion-Guest",
					String.format("Received request (id: %d, action: %s, data: %s)", id, action, data));
		}

		@Override
		public void onResponse(long id, Object data) {
			Log.d("MunchkinCompanion-Guest",
					String.format("Received response (id: %d, data: %s)", id, data));
		}

		@Override
		public void onError(Throwable ex) {
			Log.e("MunchkinCompanion-Guest", "Messenger error", ex);
		}

		@Override
		public void onClose() {
			Log.d("MunchkinCompanion-Guest", "Closed messenger");
			eventEmitter.emit("close");
		}
	}
}
