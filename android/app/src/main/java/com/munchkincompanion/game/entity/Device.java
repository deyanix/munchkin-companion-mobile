package com.munchkincompanion.game.entity;

import android.os.Build;

import org.json.JSONException;
import org.json.JSONObject;

public class Device {
    public static Device fromJSON(JSONObject object) throws JSONException {
        String manufacturer = object.getString("manufacturer");
        String model = object.getString("model");
        return new Device(manufacturer, model);
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

    public JSONObject toJSON() throws JSONException {
        JSONObject object = new JSONObject();
        object.put("manufacturer", manufacturer);
        object.put("model", model);
        return object;
    }
}
