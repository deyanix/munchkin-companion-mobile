package eu.deyanix.munchkincompanion.game.entity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import eu.deyanix.munchkincompanion.game.exception.GameException;

import org.json.JSONException;
import org.json.JSONObject;

public class PlayerData {
    public static PlayerData fromJSON(JSONObject object) {
        try {
            PlayerData data = new PlayerData();
            data.setName(object.getString("name"));
            data.setLevel(object.getInt("level"));
            data.setGear(object.getInt("gear"));
            data.setGender(PlayerGender.valueOf(object.getString("gender")));
            data.setGenderChanged(object.getBoolean("genderChanged"));
            return data;
        } catch (JSONException ex) {
            throw new GameException(ex);
        }
    }

    public static PlayerData fromMap(ReadableMap map) {
        PlayerData data = new PlayerData();
        data.setName(map.getString("name"));
        data.setLevel(map.getInt("level"));
        data.setGear(map.getInt("gear"));
        data.setGender(PlayerGender.valueOf(map.getString("gender")));
        data.setGenderChanged(map.getBoolean("genderChanged"));
        return data;
    }

    private String name;
    private int level;
    private int gear;
    private PlayerGender gender;
    private boolean genderChanged;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getGear() {
        return gear;
    }

    public void setGear(int gear) {
        this.gear = gear;
    }

    public PlayerGender getGender() {
        return gender;
    }

    public void setGender(PlayerGender gender) {
        this.gender = gender;
    }

    public boolean isGenderChanged() {
        return genderChanged;
    }

    public void setGenderChanged(boolean genderChanged) {
        this.genderChanged = genderChanged;
    }

    public JSONObject toJSON() {
        try {
            JSONObject object = new JSONObject();
            object.put("name", name);
            object.put("level", level);
            object.put("gear", gear);
            object.put("gender", gender.toString());
            object.put("genderChanged", genderChanged);
            return object;
        } catch (JSONException ex) {
            throw new GameException(ex);
        }
    }

    public WritableMap toMap() {
        WritableMap map = Arguments.createMap();
        map.putString("name", name);
        map.putInt("level", level);
        map.putInt("gear", gear);
        map.putString("gender", gender.toString());
        map.putBoolean("genderChanged", genderChanged);
        return map;
    }
}
