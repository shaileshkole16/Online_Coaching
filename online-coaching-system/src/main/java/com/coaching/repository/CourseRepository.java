package com.coaching.repository;

import com.coaching.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    List<Course> findByTeacher_TeacherId(Integer teacherId);
    boolean existsByTitleAndTeacher_TeacherId(String title, Integer teacherId);
}