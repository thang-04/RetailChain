package com.sba301.retailmanagement.utils;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.Map;

public class ResponseJson {

    private static final Gson gson = new Gson();

    private ResponseJson() {
    }

    public static JsonObject toJson(ApiCode code) {
        JsonObject obj = new JsonObject();
        obj.addProperty("code", code.getValue());
        obj.addProperty("desc", code.getDefaultDesc());
        return obj;
    }

    public static JsonObject toJson(ApiCode code, String desc) {
        JsonObject obj = new JsonObject();
        obj.addProperty("code", code.getValue());
        obj.addProperty("desc",
                CommonUtils.isNullOrEmpty(desc) ? code.getDefaultDesc() : desc);
        return obj;
    }

    public static String toJsonString(ApiCode code) {
        return toJson(code).toString();
    }

    public static String toJsonString(ApiCode code, String desc) {
        return toJson(code, desc).toString();
    }

    public static String toJsonStringWithField(ApiCode code, String desc, String fieldName, String fieldValue) {
        JsonObject obj = toJson(code, desc);
        if (!CommonUtils.isNullOrEmpty(fieldName)) {
            obj.addProperty(fieldName, fieldValue);
        }
        return obj.toString();
    }

    public static String toJsonWithData(ApiCode code, String desc, Object data) {
        JsonObject obj = toJson(code, desc);
        if (data != null) {
            obj.add("data", gson.toJsonTree(data));
        }
        return obj.toString();
    }

    public static String toJsonWithData(ApiCode code, String desc, JsonArray data) {
        JsonObject obj = toJson(code, desc);
        if (data != null) {
            obj.add("data", data);
        }
        return obj.toString();
    }

    public static String toJsonWithData(ApiCode code, String desc, Map<String, Object> mapData) {
        JsonObject obj = toJson(code, desc);
        if (mapData != null) {
            obj.add("data", gson.toJsonTree(mapData));
        }
        return obj.toString();
    }
}
