package com.coaching.dto;

import lombok.Data;

@Data
public class StudentProgressResponse {
    private Integer id;
    private Integer studentId;
    private String studentName;
    private Integer courseId;
    private String courseName;
    private Integer lectureId;
    private String lectureTitle;
    private Double completionPercentage;
    private Integer lastWatchedLectureId;
    private String lastWatchedLectureTitle;
    private String lastWatchedTimestamp;
    private Integer totalTimeSpent;
    private String completedLectures;
    private String bookmarkedLectures;
    private String notes;
    private String updatedAt;
}
