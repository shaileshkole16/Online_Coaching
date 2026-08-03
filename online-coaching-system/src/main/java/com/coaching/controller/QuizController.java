package com.coaching.controller;

import com.coaching.dto.QuizRequest;
import com.coaching.dto.QuizSubmitRequest;
import com.coaching.dto.QuizResultResponse;
import com.coaching.entities.Quiz;
import com.coaching.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired private QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestBody QuizRequest req) {
        return ResponseEntity.ok(quizService.createQuiz(req));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Quiz>> getCourseQuizzes(@PathVariable Integer courseId) {
        return ResponseEntity.ok(quizService.getCourseQuizzes(courseId));
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizById(@PathVariable Integer quizId) {
        return quizService.getQuizById(quizId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{quizId}")
    public ResponseEntity<String> updateQuiz(@PathVariable Integer quizId,
                                              @RequestBody QuizRequest req) {
        return ResponseEntity.ok(quizService.updateQuiz(quizId, req));
    }

    @DeleteMapping("/delete/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Integer quizId) {
        return ResponseEntity.ok(quizService.deleteQuiz(quizId));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody QuizSubmitRequest req) {
        try {
            QuizResultResponse result = quizService.submitQuiz(req);
            if (result.getScore() < 0) {
                String errorMessage = switch (result.getScore()) {
                    case -1 -> "Quiz not found!";
                    case -2 -> "Student not found!";
                    case -3 -> "Student must be enrolled in the course to take this quiz!";
                    case -4 -> "Quiz already submitted by this student!";
                    default -> "Error submitting quiz!";
                };
                return ResponseEntity.status(400).body(errorMessage);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error submitting quiz: " + e.getMessage());
        }
    }

    @GetMapping("/submissions/quiz/{quizId}")
    public ResponseEntity<?> getQuizSubmissions(@PathVariable Integer quizId) {
        return ResponseEntity.ok(quizService.getQuizSubmissions(quizId));
    }

    @GetMapping("/submissions/course/{courseId}")
    public ResponseEntity<?> getCourseQuizSubmissions(@PathVariable Integer courseId) {
        return ResponseEntity.ok(quizService.getCourseQuizSubmissions(courseId));
    }

    @GetMapping("/check-attempt/{quizId}/{studentId}")
    public ResponseEntity<?> checkQuizAttempt(@PathVariable Integer quizId, @PathVariable Integer studentId) {
        boolean hasAttempted = quizService.hasStudentAttemptedQuiz(quizId, studentId);
        return ResponseEntity.ok(hasAttempted);
    }

    @GetMapping("/submission/{quizId}/{studentId}")
    public ResponseEntity<?> getStudentQuizSubmission(@PathVariable Integer quizId, @PathVariable Integer studentId) {
        return quizService.getStudentQuizSubmission(quizId, studentId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}