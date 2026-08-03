package com.coaching.repository;

import com.coaching.entities.CourseReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseReviewRepository extends JpaRepository<CourseReview, Integer> {
    
    List<CourseReview> findByCourse_CourseId(Integer courseId);
    
    Optional<CourseReview> findByCourse_CourseIdAndStudent_StudentId(Integer courseId, Integer studentId);
    
    @Query("SELECT AVG(cr.rating) FROM CourseReview cr WHERE cr.course.courseId = :courseId")
    Double getAverageRatingByCourse(@Param("courseId") Integer courseId);
    
    @Query("SELECT COUNT(cr) FROM CourseReview cr WHERE cr.course.courseId = :courseId")
    Long getReviewCountByCourse(@Param("courseId") Integer courseId);
    
    @Query("SELECT cr FROM CourseReview cr WHERE cr.isVerified = true ORDER BY cr.helpfulCount DESC")
    List<CourseReview> findTopVerifiedReviews();
}
