package com.coaching.service;

import com.coaching.dto.StudentProgressRequest;
import com.coaching.dto.StudentProgressResponse;
import com.coaching.entities.StudentProgress;
import com.coaching.repository.StudentProgressRepository;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentProgressService {
    
    private final StudentProgressRepository studentProgressRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final LectureRepository lectureRepository;
    
    public StudentProgressResponse updateProgress(StudentProgressRequest request) {
        Optional<StudentProgress> existingProgress = studentProgressRepository
            .findByStudent_StudentIdAndCourse_CourseId(request.getStudentId(), request.getCourseId());
        
        StudentProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            if (request.getCompletionPercentage() != null) {
                progress.setCompletionPercentage(request.getCompletionPercentage());
            }
            if (request.getLastWatchedLectureId() != null) {
                progress.setLastWatchedLecture(lectureRepository.findById(request.getLastWatchedLectureId().longValue()).orElse(null));
                progress.setLastWatchedTimestamp(java.time.LocalDateTime.now());
            }
            if (request.getTimeSpent() != null) {
                progress.setTotalTimeSpent(progress.getTotalTimeSpent() + request.getTimeSpent());
            }
            if (request.getCompletedLectures() != null) {
                progress.setCompletedLectures(request.getCompletedLectures());
            }
            if (request.getBookmarkedLectures() != null) {
                progress.setBookmarkedLectures(request.getBookmarkedLectures());
            }
            if (request.getNotes() != null) {
                progress.setNotes(request.getNotes());
            }
        } else {
            progress = new StudentProgress();
            progress.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
            progress.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow());
            progress.setCompletionPercentage(request.getCompletionPercentage() != null ? request.getCompletionPercentage() : 0.0);
            if (request.getLastWatchedLectureId() != null) {
                progress.setLastWatchedLecture(lectureRepository.findById(request.getLastWatchedLectureId().longValue()).orElse(null));
                progress.setLastWatchedTimestamp(java.time.LocalDateTime.now());
            }
            progress.setTotalTimeSpent(request.getTimeSpent() != null ? request.getTimeSpent() : 0);
            progress.setCompletedLectures(request.getCompletedLectures());
            progress.setBookmarkedLectures(request.getBookmarkedLectures());
            progress.setNotes(request.getNotes());
        }
        
        progress = studentProgressRepository.save(progress);
        return convertToResponse(progress);
    }
    
    public StudentProgressResponse getProgress(Integer studentId, Integer courseId) {
        StudentProgress progress = studentProgressRepository
            .findByStudent_StudentIdAndCourse_CourseId(studentId, courseId)
            .orElse(new StudentProgress()); // Return empty progress if not found
        return convertToResponse(progress);
    }
    
    public List<StudentProgressResponse> getStudentProgress(Integer studentId) {
        List<StudentProgress> progressList = studentProgressRepository.findByStudentId(studentId);
        return progressList.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<StudentProgressResponse> getCourseProgress(Integer courseId) {
        List<StudentProgress> progressList = studentProgressRepository.findByCourseId(courseId);
        return progressList.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public StudentProgressResponse markLectureComplete(Integer studentId, Integer courseId, Integer lectureId) {
        Optional<StudentProgress> existingProgress = studentProgressRepository
            .findByStudent_StudentIdAndCourse_CourseId(studentId, courseId);
        
        StudentProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            String completedLectures = progress.getCompletedLectures();
            if (completedLectures == null) completedLectures = "[]";
            
            // Add lecture ID to completed lectures if not already present
            if (!completedLectures.contains(lectureId.toString())) {
                completedLectures = completedLectures.substring(0, completedLectures.length() - 1) + 
                    (completedLectures.equals("[]") ? "" : ",") + lectureId + "]";
                progress.setCompletedLectures(completedLectures);
            }
            
            progress.setLastWatchedLecture(lectureRepository.findById(lectureId.longValue()).orElse(null));
            progress.setLastWatchedTimestamp(java.time.LocalDateTime.now());
        } else {
            progress = new StudentProgress();
            progress.setStudent(studentRepository.findById(studentId).orElseThrow());
            progress.setCourse(courseRepository.findById(courseId).orElseThrow());
            progress.setCompletedLectures("[" + lectureId + "]");
            progress.setLastWatchedLecture(lectureRepository.findById(lectureId.longValue()).orElse(null));
            progress.setLastWatchedTimestamp(java.time.LocalDateTime.now());
            progress.setTotalTimeSpent(0);
        }
        
        progress = studentProgressRepository.save(progress);
        return convertToResponse(progress);
    }
    
    public StudentProgressResponse bookmarkLecture(Integer studentId, Integer courseId, Integer lectureId) {
        Optional<StudentProgress> existingProgress = studentProgressRepository
            .findByStudent_StudentIdAndCourse_CourseId(studentId, courseId);
        
        StudentProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            String bookmarkedLectures = progress.getBookmarkedLectures();
            if (bookmarkedLectures == null) bookmarkedLectures = "[]";
            
            if (!bookmarkedLectures.contains(lectureId.toString())) {
                bookmarkedLectures = bookmarkedLectures.substring(0, bookmarkedLectures.length() - 1) + 
                    (bookmarkedLectures.equals("[]") ? "" : ",") + lectureId + "]";
                progress.setBookmarkedLectures(bookmarkedLectures);
            }
        } else {
            progress = new StudentProgress();
            progress.setStudent(studentRepository.findById(studentId).orElseThrow());
            progress.setCourse(courseRepository.findById(courseId).orElseThrow());
            progress.setBookmarkedLectures("[" + lectureId + "]");
            progress.setTotalTimeSpent(0);
        }
        
        progress = studentProgressRepository.save(progress);
        return convertToResponse(progress);
    }
    
    public StudentProgressResponse removeBookmark(Integer studentId, Integer courseId, Integer lectureId) {
        StudentProgress progress = studentProgressRepository
            .findByStudent_StudentIdAndCourse_CourseId(studentId, courseId)
            .orElseThrow();
        
        String bookmarkedLectures = progress.getBookmarkedLectures();
        if (bookmarkedLectures != null && bookmarkedLectures.contains(lectureId.toString())) {
            bookmarkedLectures = bookmarkedLectures.replace(lectureId.toString() + ",", "")
                .replace("," + lectureId.toString(), "")
                .replace("[" + lectureId.toString() + "]", "[]");
            progress.setBookmarkedLectures(bookmarkedLectures);
        }
        
        progress = studentProgressRepository.save(progress);
        return convertToResponse(progress);
    }
    
    private StudentProgressResponse convertToResponse(StudentProgress progress) {
        StudentProgressResponse response = new StudentProgressResponse();
        if (progress.getId() != null) {
            response.setId(progress.getId());
            response.setStudentId(progress.getStudent().getStudentId());
            response.setStudentName(progress.getStudent().getUser().getName());
            response.setCourseId(progress.getCourse().getCourseId());
            response.setCourseName(progress.getCourse().getTitle());
            response.setCompletionPercentage(progress.getCompletionPercentage());
            response.setTotalTimeSpent(progress.getTotalTimeSpent());
            response.setCompletedLectures(progress.getCompletedLectures());
            response.setBookmarkedLectures(progress.getBookmarkedLectures());
            response.setNotes(progress.getNotes());
            response.setUpdatedAt(progress.getUpdatedAt() != null ? progress.getUpdatedAt().toString() : null);
            
            if (progress.getLecture() != null) {
                response.setLectureId(progress.getLecture().getLectureId().intValue());
                response.setLectureTitle(progress.getLecture().getTitle());
            }
            
            if (progress.getLastWatchedLecture() != null) {
                response.setLastWatchedLectureId(progress.getLastWatchedLecture().getLectureId().intValue());
                response.setLastWatchedLectureTitle(progress.getLastWatchedLecture().getTitle());
                response.setLastWatchedTimestamp(progress.getLastWatchedTimestamp().toString());
            }
        }
        return response;
    }
}
