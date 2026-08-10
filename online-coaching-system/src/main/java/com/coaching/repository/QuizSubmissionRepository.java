package com.coaching.repository;

import com.coaching.entities.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Integer> {
    boolean existsByQuiz_QuizIdAndStudent_StudentId(Integer quizId, Integer studentId);
    boolean existsByQuiz_QuizIdAndStudent_StudentId(Long quizId, Integer studentId);
    List<QuizSubmission> findByQuiz_QuizId(Integer quizId);
    List<QuizSubmission> findByStudent_StudentId(Integer studentId);
    List<QuizSubmission> findByQuiz_Course_CourseId(Integer courseId);
    List<QuizSubmission> findByQuiz_QuizIdAndStudent_StudentId(Integer quizId, Integer studentId);
    
    @Transactional
    void deleteByStudent_StudentId(Integer studentId);
    
    @Transactional
    void deleteByQuiz_QuizId(Integer quizId);
}