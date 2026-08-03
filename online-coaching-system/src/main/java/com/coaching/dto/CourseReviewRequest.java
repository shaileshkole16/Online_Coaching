package com.coaching.dto;

import lombok.Data;

@Data
public class CourseReviewRequest {
    private Integer courseId;
    private Integer studentId;
    private Integer rating;
    private String reviewText;
}
