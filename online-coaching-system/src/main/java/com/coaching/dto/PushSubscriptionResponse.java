package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PushSubscriptionResponse {
    private Integer id;
    private Integer userId;
    private String endpoint;
    private String p256dhKey;
    private String authKey;
    private String userAgent;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime lastUsedAt;
}
