package com.coaching.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyMaterialResponse {
    private Integer id;
    private String title;
    private String fileName;
    private LocalDate uploadDate;
    private Integer courseId;
}
