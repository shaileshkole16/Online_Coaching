package com.coaching.repository;

import com.coaching.entities.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Integer> {
    List<StudyMaterial> findByCourse_CourseId(Integer courseId);
    boolean existsByTitleAndCourse_CourseId(String title, Integer courseId);
    
    @Transactional
    void deleteByCourse_CourseId(Integer courseId);
}
