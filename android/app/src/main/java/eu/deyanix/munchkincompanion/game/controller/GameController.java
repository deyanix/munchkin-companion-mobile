package eu.deyanix.munchkincompanion.game.controller;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import eu.deyanix.munchkincompanion.game.entity.Player;
import eu.deyanix.munchkincompanion.game.entity.PlayerData;
import eu.deyanix.munchkincompanion.game.reactnative.ReactEventEmitter;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public abstract class GameController implements Closeable {
    protected final ReactEventEmitter eventEmitter;
    private final List<Player> players = new ArrayList<>();

    protected GameController(ReactEventEmitter eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> newPlayers) {
        players.clear();
        players.addAll(newPlayers);
        emitUpdate();
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
