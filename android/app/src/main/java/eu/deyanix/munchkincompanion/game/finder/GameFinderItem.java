package eu.deyanix.munchkincompanion.game.finder;

import eu.deyanix.munchkincompanion.game.entity.Device;

import java.time.LocalDateTime;

public class GameFinderItem {
    private LocalDateTime lastSeen;
    private Device device;

    public GameFinderItem() {
        this.lastSeen = LocalDateTime.now();
    }

    public void see() {
        lastSeen = LocalDateTime.now();
    }

    public LocalDateTime getLastSeen() {
        return lastSeen;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public Device getDevice() {
        return device;
    }
}
