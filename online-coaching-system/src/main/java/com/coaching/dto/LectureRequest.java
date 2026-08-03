package com.coaching.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureRequest {
    private String title;
    private String description;
    private String videoUrl;
    private int lectureOrder;
    private LocalDate uploadDate;
    private Integer courseId;
}