package com.coaching.dto;

import lombok.Data;

@Data
public class StudentProgressRequest {
    private Integer studentId;
    private Integer courseId;
    private Integer lectureId;
    private Double completionPercentage;
    private Integer lastWatchedLectureId;
    private Integer timeSpent; // in minutes
    private String completedLectures; // JSON array
    private String bookmarkedLectures; // JSON array
    private String notes;
}
