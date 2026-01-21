package com.sba301.retailmanagement.utils;

import lombok.Getter;

@Getter
public enum ApiCode {
    SUCCESSFUL(200, "Successful"),
    NOT_AUTHORIZED(201, "Not authorized"),
    UNSUCCESSFUL(202, "Unsuccessful"),
    USERS_NOT_FOUND(208, "Users not found"),
    BAD_REQUEST_ERROR(400, "Bad request"),
    TOKEN_EXPIRED(420, "Token expired"),
    NOT_FOUND(404, "Not Found"),
    ERROR_INTERNAL(500, "Internal error");

    private final int value;
    private final String defaultDesc;

    ApiCode(int value, String defaultDesc) {
        this.value = value;
        this.defaultDesc = defaultDesc;
    }
}
