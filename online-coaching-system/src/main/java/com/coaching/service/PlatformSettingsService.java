package com.coaching.service;

import com.coaching.entities.PlatformSettings;
import com.coaching.repository.PlatformSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlatformSettingsService {

    @Autowired
    private PlatformSettingsRepository platformSettingsRepository;

    public PlatformSettings getSettings() {
        try {
            Optional<PlatformSettings> settings = platformSettingsRepository.findFirstByOrderByIdAsc();
            return settings.orElseGet(() -> {
                PlatformSettings defaultSettings = new PlatformSettings();
                defaultSettings.setPlatformName("Online Coaching");
                defaultSettings.setContactEmail("admin@onlinecoaching.com");
                defaultSettings.setMaintenanceMode(false);
                defaultSettings.setRegistrationEnabled(true);
                defaultSettings.setTeacherRegistrationRequiresApproval(true);
                defaultSettings.setDefaultCourseApprovalRequired(false);
                defaultSettings.setMaxFileSizeMb(100);
                defaultSettings.setAllowedVideoFormats("mp4,avi,mov,mkv");
                return platformSettingsRepository.save(defaultSettings);
            });
        } catch (Exception e) {
            // Table doesn't exist, return default settings
            PlatformSettings defaultSettings = new PlatformSettings();
            defaultSettings.setPlatformName("Online Coaching");
            defaultSettings.setContactEmail("admin@onlinecoaching.com");
            defaultSettings.setMaintenanceMode(false);
            defaultSettings.setRegistrationEnabled(true);
            defaultSettings.setTeacherRegistrationRequiresApproval(true);
            defaultSettings.setDefaultCourseApprovalRequired(false);
            defaultSettings.setMaxFileSizeMb(100);
            defaultSettings.setAllowedVideoFormats("mp4,avi,mov,mkv");
            return defaultSettings;
        }
    }

    public PlatformSettings updateSettings(PlatformSettings settings) {
        try {
            Optional<PlatformSettings> existingSettings = platformSettingsRepository.findFirstByOrderByIdAsc();
            if (existingSettings.isPresent()) {
                PlatformSettings current = existingSettings.get();
                current.setPlatformName(settings.getPlatformName());
                current.setPlatformDescription(settings.getPlatformDescription());
                current.setContactEmail(settings.getContactEmail());
                current.setContactPhone(settings.getContactPhone());
                current.setMaintenanceMode(settings.getMaintenanceMode());
                current.setRegistrationEnabled(settings.getRegistrationEnabled());
                current.setTeacherRegistrationRequiresApproval(settings.getTeacherRegistrationRequiresApproval());
                current.setDefaultCourseApprovalRequired(settings.getDefaultCourseApprovalRequired());
                current.setMaxFileSizeMb(settings.getMaxFileSizeMb());
                current.setAllowedVideoFormats(settings.getAllowedVideoFormats());
                return platformSettingsRepository.save(current);
            } else {
                return platformSettingsRepository.save(settings);
            }
        } catch (Exception e) {
            // Table doesn't exist, just return the input settings
            return settings;
        }
    }
}