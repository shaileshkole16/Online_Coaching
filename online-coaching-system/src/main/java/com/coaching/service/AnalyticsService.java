package com.coaching.service;

import com.coaching.dto.AnalyticsEventRequest;
import com.coaching.entities.AnalyticsEvent;
import com.coaching.repository.AnalyticsEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsEventRepository analyticsEventRepository;

    public AnalyticsEvent trackEvent(AnalyticsEventRequest request) {
        AnalyticsEvent event = AnalyticsEvent.builder()
            .eventName(request.getEventName())
            .properties(request.getProperties())
            .sessionId(request.getSessionId())
            .userId(request.getUserId())
            .userRole(request.getUserRole())
            .deviceInfo(request.getDeviceInfo())
            .appVersion(request.getAppVersion())
            .platform(request.getPlatform())
            .ipAddress(request.getIpAddress())
            .userAgent(request.getUserAgent())
            .build();

        return analyticsEventRepository.save(event);
    }

    public List<AnalyticsEvent> getEventsBySession(String sessionId) {
        return analyticsEventRepository.findBySessionId(sessionId);
    }

    public List<AnalyticsEvent> getEventsByUser(Long userId) {
        return analyticsEventRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<AnalyticsEvent> getEventsByName(String eventName) {
        return analyticsEventRepository.findByEventName(eventName);
    }

    public Map<String, Object> getAnalyticsSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        // Total events
        long totalEvents = analyticsEventRepository.count();
        summary.put("totalEvents", totalEvents);
        
        // Events by type
        List<Object[]> eventsByType = analyticsEventRepository.countEventsByType();
        Map<String, Long> eventsByTypeMap = eventsByType.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (Long) row[1]
            ));
        summary.put("eventsByType", eventsByTypeMap);
        
        // Events in last 24 hours
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        long recentEvents = analyticsEventRepository.countEventsInDateRange(yesterday, LocalDateTime.now());
        summary.put("recentEvents", recentEvents);
        
        // Events in last 7 days
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long weeklyEvents = analyticsEventRepository.countEventsInDateRange(weekAgo, LocalDateTime.now());
        summary.put("weeklyEvents", weeklyEvents);
        
        return summary;
    }

    public Map<String, Object> getUserAnalytics(Long userId) {
        Map<String, Object> userAnalytics = new HashMap<>();
        
        List<AnalyticsEvent> userEvents = analyticsEventRepository.findByUserIdOrderByCreatedAtDesc(userId);
        userAnalytics.put("totalEvents", userEvents.size());
        userAnalytics.put("recentEvents", userEvents);
        
        // Events by type for this user
        Map<String, Long> eventsByType = userEvents.stream()
            .collect(Collectors.groupingBy(
                AnalyticsEvent::getEventName,
                Collectors.counting()
            ));
        userAnalytics.put("eventsByType", eventsByType);
        
        return userAnalytics;
    }

    public List<AnalyticsEvent> getEventsInDateRange(LocalDateTime start, LocalDateTime end) {
        return analyticsEventRepository.findByCreatedAtBetween(start, end);
    }
}
