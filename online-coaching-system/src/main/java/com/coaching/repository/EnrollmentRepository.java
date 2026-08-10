package com.coaching.repository;

import com.coaching.entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByStudent_StudentId(Integer studentId);
    List<Enrollment> findByCourse_CourseId(Integer courseId);
    boolean existsByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
//    Enrollment findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    Optional<Enrollment> findByStudent_StudentIdAndCourse_CourseId(
            Integer studentId,
            Integer courseId
    );
    
    @Transactional
    void deleteByStudent_StudentId(Integer studentId);
    
    @Transactional
    void deleteByCourse_CourseId(Integer courseId);
}
