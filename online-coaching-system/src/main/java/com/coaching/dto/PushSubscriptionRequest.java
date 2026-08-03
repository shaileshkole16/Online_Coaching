package com.coaching.dto;

import lombok.Data;

@Data
public class PushSubscriptionRequest {
    private Integer userId;
    private String endpoint;
    private String p256dhKey;
    private String authKey;
    private String userAgent;
}
