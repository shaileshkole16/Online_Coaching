package com.coaching.repository;

import com.coaching.entities.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Integer> {
    List<Result> findByStudent_StudentId(Integer studentId);
    List<Result> findByCourse_CourseId(Integer courseId);
    boolean existsByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    Optional<Result> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
}
