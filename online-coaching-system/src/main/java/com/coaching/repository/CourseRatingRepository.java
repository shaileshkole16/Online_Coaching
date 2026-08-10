package com.coaching.repository;

import com.coaching.entities.CourseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CourseRatingRepository extends JpaRepository<CourseRating, Integer> {
    Optional<CourseRating> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    List<CourseRating> findByCourse_CourseId(Integer courseId);
    List<CourseRating> findByCourse_Teacher_TeacherId(Integer teacherId);
    boolean existsByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    
    @Transactional
    void deleteByCourse_CourseId(Integer courseId);
}
