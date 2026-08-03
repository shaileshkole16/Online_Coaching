package com.coaching.controller;

import com.coaching.dto.AnalyticsEventRequest;
import com.coaching.entities.AnalyticsEvent;
import com.coaching.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @PostMapping("/track")
    public ResponseEntity<AnalyticsEvent> trackEvent(@RequestBody AnalyticsEventRequest request) {
        return ResponseEntity.ok(analyticsService.trackEvent(request));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<AnalyticsEvent>> getEventsBySession(@PathVariable String sessionId) {
        return ResponseEntity.ok(analyticsService.getEventsBySession(sessionId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserAnalytics(@PathVariable Long userId) {
        return ResponseEntity.ok(analyticsService.getUserAnalytics(userId));
    }

    @GetMapping("/event/{eventName}")
    public ResponseEntity<List<AnalyticsEvent>> getEventsByName(@PathVariable String eventName) {
        return ResponseEntity.ok(analyticsService.getEventsByName(eventName));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        return ResponseEntity.ok(analyticsService.getAnalyticsSummary());
    }

    @GetMapping("/range")
    public ResponseEntity<List<AnalyticsEvent>> getEventsInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(analyticsService.getEventsInDateRange(start, end));
    }
}
