package com.coaching.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Integer id;
    private String title;
    private String description;
    private String duration;
    private String level;
    private BigDecimal price;
    private LocalDate createdDate;
    private Integer teacherId;
    private String teacherName;
    private Integer enrolledCount;
}
