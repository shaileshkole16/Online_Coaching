package com.coaching.controller;

import com.coaching.entities.QuizSubmission;
import com.coaching.repository.QuizSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-submissions")
@CrossOrigin(origins = "*")
public class QuizSubmissionController {

    @Autowired private QuizSubmissionRepository quizSubmissionRepo;

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<QuizSubmission>> getQuizSubmissions(@PathVariable Integer quizId) {
        return ResponseEntity.ok(quizSubmissionRepo.findByQuiz_QuizId(quizId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<QuizSubmission>> getStudentQuizSubmissions(@PathVariable Integer studentId) {
        return ResponseEntity.ok(quizSubmissionRepo.findByStudent_StudentId(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizSubmission>> getCourseQuizSubmissions(@PathVariable Integer courseId) {
        return ResponseEntity.ok(quizSubmissionRepo.findByQuiz_Course_CourseId(courseId));
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<?> getQuizSubmissionById(@PathVariable Integer submissionId) {
        return quizSubmissionRepo.findById(submissionId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
