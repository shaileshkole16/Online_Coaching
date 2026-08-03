package com.coaching.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsEventRequest {
    private String eventName;
    private String properties; // JSON string
    private String sessionId;
    private Long userId;
    private String userRole;
    private String deviceInfo;
    private String appVersion;
    private String platform;
    private String ipAddress;
    private String userAgent;
}
