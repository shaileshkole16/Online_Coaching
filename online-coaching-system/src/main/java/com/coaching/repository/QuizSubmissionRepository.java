package com.coaching.repository;

import com.coaching.entities.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Integer> {
    boolean existsByQuiz_QuizIdAndStudent_StudentId(Integer quizId, Integer studentId);
    List<QuizSubmission> findByQuiz_QuizId(Integer quizId);
    List<QuizSubmission> findByStudent_StudentId(Integer studentId);
    List<QuizSubmission> findByQuiz_Course_CourseId(Integer courseId);
    List<QuizSubmission> findByQuiz_QuizIdAndStudent_StudentId(Integer quizId, Integer studentId);
}