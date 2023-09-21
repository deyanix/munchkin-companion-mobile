package com.munchkincompanion.game.controller;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.munchkincompanion.game.entity.Player;
import com.munchkincompanion.game.entity.PlayerData;
import com.munchkincompanion.game.reactnative.ReactEventEmitter;

import org.json.JSONArray;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Consumer;

public abstract class GameController implements Closeable {
    protected final ReactEventEmitter eventEmitter;
    private final List<Player> players = new ArrayList<>();

    protected GameController(ReactEventEmitter eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public abstract void createPlayer(PlayerData player);

    public abstract void updatePlayer(Player player);

    public abstract void deletePlayer(int playerId);

    public abstract String getName();

    public void close() throws IOException {
        // Nothing.
    }

    protected void replacePlayers(Collection<Player> players) {
        this.players.clear();
        this.players.addAll(players);
        emitUpdate();
    }

    protected void appendLocallyPlayer(Player player) {
        players.add(player);
        emitUpdate();
    }

    protected void updateLocallyPlayer(Player player) {
        players.stream()
                .filter(p -> p.getId() == player.getId())
                .findFirst()
                .ifPresent(p -> p.adaptData(player));
        emitUpdate();
    }

    protected void deleteLocallyPlayer(int playerId) {
        players.removeIf(p -> p.getId() == playerId);
        emitUpdate();
    }

    protected void emitUpdate() {
        WritableArray array = Arguments.createArray();
        players.stream()
                .map(Player::toMap)
                .forEach(array::pushMap);

        eventEmitter.emit("update-player", array);
    }
}
