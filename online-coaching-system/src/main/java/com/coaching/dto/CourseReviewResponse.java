package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CourseReviewResponse {
    private Integer id;
    private Integer courseId;
    private String courseName;
    private Integer studentId;
    private String studentName;
    private Integer rating;
    private String reviewText;
    private Boolean isVerified;
    private Integer helpfulCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
