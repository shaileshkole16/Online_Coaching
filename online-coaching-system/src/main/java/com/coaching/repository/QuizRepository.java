package com.coaching.repository;

import com.coaching.entities.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    List<Quiz> findByCourse_CourseId(Integer courseId);
    boolean existsByTitleAndCourse_CourseId(String title, Integer courseId);
}