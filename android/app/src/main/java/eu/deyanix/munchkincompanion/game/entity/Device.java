package eu.deyanix.munchkincompanion.game.entity;

import android.os.Build;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import eu.deyanix.munchkincompanion.game.exception.GameException;

import org.json.JSONException;
import org.json.JSONObject;

public class Device {
    public static Device fromJSON(JSONObject object) {
        try {
            String manufacturer = object.getString("manufacturer");
            String model = object.getString("model");
            return new Device(manufacturer, model);
        } catch (JSONException ex) {
            throw new GameException(ex);
        }
    }

    public static Device getCurrent() {
        return new Device(Build.MANUFACTURER, Build.MODEL);
    }

    public final String manufacturer;
    public final String model;

    public Device(String manufacturer, String model) {
        this.manufacturer = manufacturer;
        this.model = model;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public String getModel() {
        return model;
    }

    public JSONObject toJSON() {
        try {
            JSONObject object = new JSONObject();
            object.put("manufacturer", manufacturer);
            object.put("model", model);
            return object;
        } catch (JSONException ex) {
            throw new GameException(ex);
        }
    }

    public WritableMap toMap() {
        WritableMap map = Arguments.createMap();
        map.putString("manufacturer", manufacturer);
        map.putString("model", model);
        return map;
    }
}
