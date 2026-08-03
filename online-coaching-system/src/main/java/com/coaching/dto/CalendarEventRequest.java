package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CalendarEventRequest {
    private Integer userId;
    private String eventType; // ASSIGNMENT, QUIZ, LECTURE, LIVE_CLASS, EXAM, MEETING, OTHER
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String location;
    private Integer courseId;
    private Integer assignmentId;
    private Integer quizId;
    private Integer liveClassId;
    private Boolean isAllDay;
    private Integer reminderMinutes;
    private String status; // SCHEDULED, COMPLETED, CANCELLED
}
