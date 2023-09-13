package com.munchkincompanion.game.finder;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.recadel.sjp.discovery.SjpDiscoveryClient;

import java.net.Socket;
import java.net.SocketAddress;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Map;

public class GameFinder {
    private SjpDiscoveryClient discoveryClient;
    private Map<SocketAddress, Socket> sockets = new HashMap<>();

    public GameFinder(SocketAddress socketAddress) throws SocketException {
        discoveryClient = new SjpDiscoveryClient(socketAddress);
    }

    public void start() {
        discoveryClient.discover(address -> {
            WritableMap result = Arguments.createMap();
            result.putString("address", address.getAddress().getHostAddress());
            result.putInt("port", address.getPort());
            connect(address);
        });
    }

    private void connect(SocketAddress address) {

    }
}
