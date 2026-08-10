package com.coaching.repository;

import com.coaching.entities.LectureProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LectureProgressRepository extends JpaRepository<LectureProgress, Integer> {
    List<LectureProgress> findByStudent_StudentId(Integer studentId);
    List<LectureProgress> findByLecture_LectureId(Long lectureId);
    Optional<LectureProgress> findByStudent_StudentIdAndLecture_LectureId(Integer studentId, Long lectureId);
    List<LectureProgress> findByStudent_StudentIdAndLecture_Course_CourseId(Integer studentId, Integer courseId);
    boolean existsByStudent_StudentIdAndLecture_LectureId(Integer studentId, Long lectureId);
}