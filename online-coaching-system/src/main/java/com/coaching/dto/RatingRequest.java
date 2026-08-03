package com.coaching.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private Integer studentId;
    private Integer teacherId;
    private Integer rating;
    private String comment;
}
