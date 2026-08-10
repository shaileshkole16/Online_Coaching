package com.coaching.repository;

import com.coaching.entities.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    List<Assignment> findByCourse_CourseId(Integer courseId);
    boolean existsByTitleAndCourse_CourseId(String title, Integer courseId);
    
    @Transactional
    void deleteByCourse_CourseId(Integer courseId);
}
