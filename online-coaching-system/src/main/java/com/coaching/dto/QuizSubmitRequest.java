// QuizSubmitRequest.java
package com.coaching.dto;

import lombok.*;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmitRequest {
    private Integer quizId;
    private Integer studentId;
    private int score;
    private Map<Integer, Integer> answers; // questionIndex -> selectedOptionIndex
}