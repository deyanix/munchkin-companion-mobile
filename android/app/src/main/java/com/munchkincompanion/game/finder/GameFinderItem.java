package com.munchkincompanion.game.finder;

import com.munchkincompanion.game.entity.Device;

import java.net.Socket;

public class GameFinderItem {
    private final Socket socket;
    private Device device;

    public GameFinderItem(Socket socket) {
        this.socket = socket;
    }
}
