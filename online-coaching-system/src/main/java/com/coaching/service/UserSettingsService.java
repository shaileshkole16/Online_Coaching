package com.coaching.service;


import com.coaching.dto.UserSettingsRequest;
import com.coaching.dto.UserSettingsResponse;
import com.coaching.entities.UserSettings;
import com.coaching.repository.UserRepository;
import com.coaching.repository.UserSettingsRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserSettingsService {
    
    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;
    
    public UserSettingsResponse createSettings(UserSettingsRequest request) {
        UserSettings settings = new UserSettings();
        settings.setUser(userRepository.findById(request.getUserId()).orElseThrow());
        settings.setLanguage(request.getLanguage());
        settings.setTimezone(request.getTimezone());
        settings.setThemePreference(request.getThemePreference());
        settings.setEmailNotificationsEnabled(request.getEmailNotificationsEnabled());
        settings.setPushNotificationsEnabled(request.getPushNotificationsEnabled());
        settings.setMarketingEmailsEnabled(request.getMarketingEmailsEnabled());
        settings.setCourseUpdatesEnabled(request.getCourseUpdatesEnabled());
        settings.setDiscussionRepliesEnabled(request.getDiscussionRepliesEnabled());
        settings.setProfileVisibility(request.getProfileVisibility());
        settings.setShowOnlineStatus(request.getShowOnlineStatus());
        settings.setAllowMessagesFrom(request.getAllowMessagesFrom());
        
        settings = userSettingsRepository.save(settings);
        return convertToResponse(settings);
    }
    
    public UserSettingsResponse updateSettings(Integer settingsId, UserSettingsRequest request) {
        UserSettings settings = userSettingsRepository.findById(settingsId).orElseThrow();
        if (request.getLanguage() != null) settings.setLanguage(request.getLanguage());
        if (request.getTimezone() != null) settings.setTimezone(request.getTimezone());
        if (request.getThemePreference() != null) settings.setThemePreference(request.getThemePreference());
        if (request.getEmailNotificationsEnabled() != null) settings.setEmailNotificationsEnabled(request.getEmailNotificationsEnabled());
        if (request.getPushNotificationsEnabled() != null) settings.setPushNotificationsEnabled(request.getPushNotificationsEnabled());
        if (request.getMarketingEmailsEnabled() != null) settings.setMarketingEmailsEnabled(request.getMarketingEmailsEnabled());
        if (request.getCourseUpdatesEnabled() != null) settings.setCourseUpdatesEnabled(request.getCourseUpdatesEnabled());
        if (request.getDiscussionRepliesEnabled() != null) settings.setDiscussionRepliesEnabled(request.getDiscussionRepliesEnabled());
        if (request.getProfileVisibility() != null) settings.setProfileVisibility(request.getProfileVisibility());
        if (request.getShowOnlineStatus() != null) settings.setShowOnlineStatus(request.getShowOnlineStatus());
        if (request.getAllowMessagesFrom() != null) settings.setAllowMessagesFrom(request.getAllowMessagesFrom());
        
        settings = userSettingsRepository.save(settings);
        return convertToResponse(settings);
    }
    
    public UserSettingsResponse getUserSettings(Integer userId) {
        Optional<UserSettings> settings = userSettingsRepository.findByUser_UserId(userId);
        if (settings.isPresent()) {
            return convertToResponse(settings.get());
        }
        UserSettingsRequest request = new UserSettingsRequest();
        request.setUserId(userId);
        request.setLanguage("en");
        request.setTimezone("UTC");
        request.setThemePreference("light");
        request.setEmailNotificationsEnabled(true);
        request.setPushNotificationsEnabled(true);
        request.setMarketingEmailsEnabled(false);
        request.setCourseUpdatesEnabled(true);
        request.setDiscussionRepliesEnabled(true);
        request.setProfileVisibility("public");
        request.setShowOnlineStatus(true);
        request.setAllowMessagesFrom("everyone");
        return createSettings(request);
    }
    
    public void deleteSettings(Integer settingsId) {
        userSettingsRepository.deleteById(settingsId);
    }
    
    private UserSettingsResponse convertToResponse(UserSettings settings) {
        UserSettingsResponse response = new UserSettingsResponse();
        response.setId(settings.getId());
        response.setUserId(settings.getUser().getUserId());
        response.setLanguage(settings.getLanguage());
        response.setTimezone(settings.getTimezone());
        response.setThemePreference(settings.getThemePreference());
        response.setEmailNotificationsEnabled(settings.getEmailNotificationsEnabled());
        response.setPushNotificationsEnabled(settings.getPushNotificationsEnabled());
        response.setMarketingEmailsEnabled(settings.getMarketingEmailsEnabled());
        response.setCourseUpdatesEnabled(settings.getCourseUpdatesEnabled());
        response.setDiscussionRepliesEnabled(settings.getDiscussionRepliesEnabled());
        response.setProfileVisibility(settings.getProfileVisibility());
        response.setShowOnlineStatus(settings.getShowOnlineStatus());
        response.setAllowMessagesFrom(settings.getAllowMessagesFrom());
        response.setCreatedAt(settings.getCreatedAt());
        response.setUpdatedAt(settings.getUpdatedAt());
        return response;
    }
}
