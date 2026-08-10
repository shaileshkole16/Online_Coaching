package com.coaching.controller;

import com.coaching.entities.LectureProgress;
import com.coaching.service.LectureProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecture-progress")
@CrossOrigin(origins = "*")
public class LectureProgressController {

    @Autowired private LectureProgressService lectureProgressService;

    @PostMapping
    public ResponseEntity<String> updateLectureProgress(@RequestBody LectureProgress progress) {
        return ResponseEntity.ok(lectureProgressService.updateLectureProgress(progress));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<LectureProgress>> getStudentProgress(@PathVariable Integer studentId) {
        return ResponseEntity.ok(lectureProgressService.getStudentProgress(studentId));
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<LectureProgress>> getCourseProgress(@PathVariable Integer studentId, @PathVariable Integer courseId) {
        return ResponseEntity.ok(lectureProgressService.getCourseProgress(studentId, courseId));
    }

    @GetMapping("/student/{studentId}/lecture/{lectureId}")
    public ResponseEntity<LectureProgress> getLectureProgress(@PathVariable Integer studentId, @PathVariable Long lectureId) {
        return lectureProgressService.getLectureProgress(studentId, lectureId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}