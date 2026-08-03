package com.coaching.repository;

import com.coaching.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByTeacher_TeacherId(Integer teacherId);
    Optional<Rating> findByStudent_StudentIdAndTeacher_TeacherId(Integer studentId, Integer teacherId);
    boolean existsByStudent_StudentIdAndTeacher_TeacherId(Integer studentId, Integer teacherId);
}
