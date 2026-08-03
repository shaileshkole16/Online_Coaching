package com.coaching.controller;

import com.coaching.dto.CalendarEventRequest;
import com.coaching.dto.CalendarEventResponse;
import com.coaching.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/calendar-events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CalendarEventController {
    
    private final CalendarEventService calendarEventService;
    
    @PostMapping("/create")
    public ResponseEntity<CalendarEventResponse> createEvent(@RequestBody CalendarEventRequest request) {
        return ResponseEntity.ok(calendarEventService.createEvent(request));
    }
    
    @PutMapping("/{eventId}")
    public ResponseEntity<CalendarEventResponse> updateEvent(
        @PathVariable Integer eventId,
        @RequestBody CalendarEventRequest request
    ) {
        return ResponseEntity.ok(calendarEventService.updateEvent(eventId, request));
    }
    
    @GetMapping("/{eventId}")
    public ResponseEntity<CalendarEventResponse> getEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(calendarEventService.getEvent(eventId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CalendarEventResponse>> getUserEvents(@PathVariable Integer userId) {
        return ResponseEntity.ok(calendarEventService.getUserEvents(userId));
    }
    
    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<CalendarEventResponse>> getUserEventsByDateRange(
        @PathVariable Integer userId,
        @RequestParam LocalDateTime start,
        @RequestParam LocalDateTime end
    ) {
        return ResponseEntity.ok(calendarEventService.getUserEventsByDateRange(userId, start, end));
    }
    
    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<CalendarEventResponse>> getUpcomingEvents(@PathVariable Integer userId) {
        return ResponseEntity.ok(calendarEventService.getUpcomingEvents(userId));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CalendarEventResponse>> getCourseEvents(@PathVariable Integer courseId) {
        return ResponseEntity.ok(calendarEventService.getCourseEvents(courseId));
    }
    
    @DeleteMapping("/{eventId}")
    public ResponseEntity<String> deleteEvent(@PathVariable Integer eventId) {
        calendarEventService.deleteEvent(eventId);
        return ResponseEntity.ok("Event deleted successfully");
    }
}
