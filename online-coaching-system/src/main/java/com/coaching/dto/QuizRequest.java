// QuizRequest.java
package com.coaching.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizRequest {
    private String title;
    private String description;
    private int totalMarks;
    private LocalDate quizDate;
    private Integer duration;
    private Integer passingScore;
    private String questions;
    private Integer courseId;
}