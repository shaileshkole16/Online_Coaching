package com.coaching.controller;

import com.coaching.dto.StudentProgressRequest;
import com.coaching.dto.StudentProgressResponse;
import com.coaching.service.StudentProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student-progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentProgressController {
    
    private final StudentProgressService studentProgressService;
    
    @PostMapping("/update")
    public ResponseEntity<StudentProgressResponse> updateProgress(@RequestBody StudentProgressRequest request) {
        return ResponseEntity.ok(studentProgressService.updateProgress(request));
    }
    
    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<StudentProgressResponse> getProgress(
        @PathVariable Integer studentId,
        @PathVariable Integer courseId
    ) {
        return ResponseEntity.ok(studentProgressService.getProgress(studentId, courseId));
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentProgressResponse>> getStudentProgress(@PathVariable Integer studentId) {
        return ResponseEntity.ok(studentProgressService.getStudentProgress(studentId));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<StudentProgressResponse>> getCourseProgress(@PathVariable Integer courseId) {
        return ResponseEntity.ok(studentProgressService.getCourseProgress(courseId));
    }
    
    @PostMapping("/mark-complete")
    public ResponseEntity<StudentProgressResponse> markLectureComplete(
        @RequestParam Integer studentId,
        @RequestParam Integer courseId,
        @RequestParam Integer lectureId
    ) {
        return ResponseEntity.ok(studentProgressService.markLectureComplete(studentId, courseId, lectureId));
    }
    
    @PostMapping("/bookmark")
    public ResponseEntity<StudentProgressResponse> bookmarkLecture(
        @RequestParam Integer studentId,
        @RequestParam Integer courseId,
        @RequestParam Integer lectureId
    ) {
        return ResponseEntity.ok(studentProgressService.bookmarkLecture(studentId, courseId, lectureId));
    }
    
    @DeleteMapping("/bookmark")
    public ResponseEntity<StudentProgressResponse> removeBookmark(
        @RequestParam Integer studentId,
        @RequestParam Integer courseId,
        @RequestParam Integer lectureId
    ) {
        return ResponseEntity.ok(studentProgressService.removeBookmark(studentId, courseId, lectureId));
    }
}
