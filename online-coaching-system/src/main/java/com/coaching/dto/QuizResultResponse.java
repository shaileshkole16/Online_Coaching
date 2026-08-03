package com.coaching.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {
    private Integer submissionId;
    private Integer quizId;
    private String quizTitle;
    private Integer score;
    private Integer totalMarks;
    private Integer passingScore;
    private String grade;
    private String submittedDate;
    private List<QuestionResult> questionResults;
    private int correctCount;
    private int totalQuestions;
    private boolean passed;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResult {
        private int questionIndex;
        private String question;
        private List<String> options;
        private Integer correctAnswer;
        private Integer studentAnswer;
        private boolean isCorrect;
        private String correctAnswerText;
        private String studentAnswerText;
    }
}
