package com.coaching.repository;

import com.coaching.entities.CourseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseCategoryRepository extends JpaRepository<CourseCategory, Integer> {
    
    List<CourseCategory> findByCourse_CourseId(Integer courseId);
    
    List<CourseCategory> findByCategory_Id(Integer categoryId);
}
