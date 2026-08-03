package com.coaching.dto;

import lombok.Data;

@Data
public class AuditLogRequest {
    private Integer userId;
    private String action; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, APPROVE, REJECT, EXPORT, IMPORT
    private String entityType;
    private Integer entityId;
    private String oldValue;
    private String newValue;
    private String ipAddress;
    private String userAgent;
}
