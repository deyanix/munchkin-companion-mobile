package eu.deyanix.munchkincompanion.game.controller;

import eu.deyanix.munchkincompanion.game.entity.Player;
import eu.deyanix.munchkincompanion.game.entity.PlayerData;
import eu.deyanix.munchkincompanion.game.reactnative.ReactEventEmitter;

import java.util.List;

public class LocalGameController extends GameController {
    private int nextPlayerId = 1;

    public LocalGameController(ReactEventEmitter eventEmitter) {
        super(eventEmitter);
    }

    @Override
    public void setPlayers(List<Player> players) {
        super.setPlayers(players);
        players.stream()
                .mapToInt(Player::getId)
                .max()
                .ifPresent(maximalId -> nextPlayerId = maximalId + 1);
    }

    @Override
    public void createPlayer(PlayerData data) {
        createLocallyPlayer(data);
    }

    @Override
    public void updatePlayer(Player player) {
        updateLocallyPlayer(player);
    }

    @Override
    public void deletePlayer(int playerId) {
        deleteLocallyPlayer(playerId);
    }

    @Override
    public String getName() {
        return "LOCAL";
    }

    protected Player createLocallyPlayer(PlayerData data) {
        Player player = new Player(nextPlayerId++, data);
        appendLocallyPlayer(player);
        return player;
    }
}
