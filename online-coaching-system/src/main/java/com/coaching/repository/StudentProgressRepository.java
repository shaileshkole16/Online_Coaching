package com.coaching.repository;

import com.coaching.entities.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Integer> {
    
    Optional<StudentProgress> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    
    @Query("SELECT sp FROM StudentProgress sp WHERE sp.student.studentId = :studentId")
    java.util.List<StudentProgress> findByStudentId(@Param("studentId") Integer studentId);
    
    @Query("SELECT sp FROM StudentProgress sp WHERE sp.course.courseId = :courseId")
    java.util.List<StudentProgress> findByCourseId(@Param("courseId") Integer courseId);
    
    @Query("SELECT AVG(sp.completionPercentage) FROM StudentProgress sp WHERE sp.course.courseId = :courseId")
    Double getAverageCompletionByCourse(@Param("courseId") Integer courseId);
}
