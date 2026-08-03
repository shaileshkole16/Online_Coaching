package com.coaching.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRequest {
    private String title;
    private String description;
    private int totalMarks;
    private LocalDate createdDate;
    private LocalDate deadline;
    private Integer courseId;
}
