package eu.deyanix.munchkincompanion.game.entity;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import eu.deyanix.munchkincompanion.game.exception.GameException;

import org.json.JSONException;
import org.json.JSONObject;

public class Player extends PlayerData {
    public static Player fromJSON(JSONObject object) {
        try {
            PlayerData data = PlayerData.fromJSON(object);
            return new Player(object.getInt("id"), data);
        } catch (JSONException e) {
            throw new GameException("Error deserializing player");
        }
    }

    public static Player fromMap(ReadableMap map) {
        PlayerData data = PlayerData.fromMap(map);
        return new Player(map.getInt("id"), data);
    }

    private final int id;

    public Player(int id) {
        this.id = id;
    }

    public Player(int id, PlayerData data) {
        this(id);
        adaptData(data);
    }

    public void adaptData(PlayerData data) {
        setName(data.getName());
        setLevel(data.getLevel());
        setGear(data.getGear());
        setGender(data.getGender());
        setGenderChanged(data.isGenderChanged());
    }

    public int getId() {
        return id;
    }

    public JSONObject toJSON() {
        try {
            JSONObject object = super.toJSON();
            object.put("id", id);
            return object;
        } catch (JSONException e) {
            throw new GameException("Error serializing player", e);
        }
    }

    public WritableMap toMap() {
        WritableMap map = super.toMap();
        map.putInt("id", id);
        return map;
    }

    @Override
    public String toString() {
		return "Player{" + "id=" + id + ',' +
                "name=" + getName() + ',' +
                "level=" + getLevel() + ',' +
                "gear=" + getGear() + ',' +
                "gender=" + getGender() + ',' +
                "genderChanged=" + isGenderChanged() +
                '}';
    }
}
