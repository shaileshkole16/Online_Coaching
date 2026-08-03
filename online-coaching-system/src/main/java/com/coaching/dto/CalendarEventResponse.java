package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CalendarEventResponse {
    private Integer id;
    private Integer userId;
    private String userName;
    private String eventType;
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String location;
    private Integer courseId;
    private String courseName;
    private Integer assignmentId;
    private String assignmentTitle;
    private Integer quizId;
    private String quizTitle;
    private Integer liveClassId;
    private String liveClassTitle;
    private Boolean isAllDay;
    private Integer reminderMinutes;
    private String status;
    private String createdAt;
    private String updatedAt;
}
