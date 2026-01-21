package com.sba301.retailmanagement.config;

public class Config {
    public static final class LINK_ACCOUNT_TYPE {
        public static final String FACEBOOK = "facebook";
        public static final String GOOGLE = "google";
        public static final String APPLE = "apple";
        public static final String PHONE = "phone";
    }

    public static final class SEND_OTP_TYPE {
        public static final String SMS = "sms";
        public static final String EMAIL = "email";
    }

    public static final class LOGIN_TYPE {
        public static final String FACEBOOK = "facebookId";
        public static final String GOOGLE = "googleId";
        public static final String APPLE = "appleId";
        public static final String PHONE = "phone";
        public static final String EMAIL = "email";
        public static final String USERNAME = "user";
        public static final String USERID = "userId";
    }

    public static final class PAYMENT_TYPE {
        public static final String VNPAY = "vnpay";
        public static final String MOMO = "momo";
        public static final String ZALOPAY = "zalopay";
        public static final String CASH = "cash";
    }


}
