package com.coaching.dto;

import lombok.Data;

@Data
public class UserSettingsRequest {
    private Integer userId;
    private String language;
    private String timezone;
    private String themePreference;
    private Boolean emailNotificationsEnabled;
    private Boolean pushNotificationsEnabled;
    private Boolean marketingEmailsEnabled;
    private Boolean courseUpdatesEnabled;
    private Boolean discussionRepliesEnabled;
    private String profileVisibility;
    private Boolean showOnlineStatus;
    private String allowMessagesFrom;
}
