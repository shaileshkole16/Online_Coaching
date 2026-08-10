package com.coaching.repository;

import com.coaching.entities.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByCourse_CourseId(Integer courseId);
    boolean existsByTitleAndCourse_CourseId(String title, Integer courseId);
    
    @Transactional
    void deleteByCourse_CourseId(Integer courseId);
}