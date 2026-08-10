package com.coaching.service;

import com.coaching.entities.LectureProgress;
import com.coaching.repository.LectureProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LectureProgressService {

    @Autowired private LectureProgressRepository lectureProgressRepo;

    public String updateLectureProgress(LectureProgress progress) {
        Optional<LectureProgress> existing = lectureProgressRepo
                .findByStudent_StudentIdAndLecture_LectureId(
                        progress.getStudent().getStudentId(), 
                        progress.getLecture().getLectureId()
                );

        if (existing.isPresent()) {
            LectureProgress existingProgress = existing.get();
            existingProgress.setWatchPercentage(progress.getWatchPercentage());
            existingProgress.setLastWatched(LocalDateTime.now());
            
            // Mark as watched if percentage >= 80%
            if (progress.getWatchPercentage() != null && progress.getWatchPercentage() >= 80) {
                existingProgress.setWatched(true);
                existingProgress.setCompletedAt(LocalDateTime.now());
            }
            
            lectureProgressRepo.save(existingProgress);
            return "Progress updated successfully!";
        } else {
            progress.setLastWatched(LocalDateTime.now());
            if (progress.getWatchPercentage() != null && progress.getWatchPercentage() >= 80) {
                progress.setWatched(true);
                progress.setCompletedAt(LocalDateTime.now());
            }
            lectureProgressRepo.save(progress);
            return "Progress recorded successfully!";
        }
    }

    public List<LectureProgress> getStudentProgress(Integer studentId) {
        return lectureProgressRepo.findByStudent_StudentId(studentId);
    }

    public List<LectureProgress> getCourseProgress(Integer studentId, Integer courseId) {
        return lectureProgressRepo.findByStudent_StudentIdAndLecture_Course_CourseId(studentId, courseId);
    }

    public Optional<LectureProgress> getLectureProgress(Integer studentId, Long lectureId) {
        return lectureProgressRepo.findByStudent_StudentIdAndLecture_LectureId(studentId, lectureId);
    }
}