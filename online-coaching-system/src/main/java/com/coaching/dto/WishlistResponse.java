package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WishlistResponse {
    private Integer id;
    private Integer studentId;
    private String studentName;
    private Integer courseId;
    private String courseName;
    private String courseDescription;
    private Double coursePrice;
    private String courseLevel;
    private String courseDuration;
    private Integer teacherId;
    private String teacherName;
    private LocalDateTime addedAt;
}
