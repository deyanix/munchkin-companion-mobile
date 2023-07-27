package com.recadel.sjp.reactnative;

import com.recadel.sjp.reactnative.manager.SjpConnectionManager;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class SjpManager {
    private final Map<Integer, SjpConnectionManager> sockets = new HashMap<>();
    private int nextSocketId = 1;

    public int allocateSocketId() {
        return nextSocketId++;
    }

    public void addConnection(SjpConnectionManager connection) {
        sockets.put(connection.getId(), connection);
    }

    public void removeConnection(int id) {
        sockets.remove(id);
    }

    public SjpConnectionManager getConnection(int id) {
        return sockets.get(id);
    }

    public void close(int id) throws IOException {
        sockets.get(id).close();
        removeConnection(id);
    }
}
