package com.coaching.controller;

import com.coaching.dto.LectureRequest;
import com.coaching.entities.Lecture;
import com.coaching.service.LectureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lectures")
@CrossOrigin(origins = "*")
public class LectureController {

    @Autowired private LectureService lectureService;

    @PostMapping("/create")
    public ResponseEntity<?> createLecture(@RequestBody LectureRequest req) {
        try {
            String result = lectureService.createLecture(req);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating lecture: " + e.getMessage());
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getCourseLectures(@PathVariable Integer courseId) {
        try {
            return ResponseEntity.ok(lectureService.getCourseLectures(courseId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching lectures: " + e.getMessage());
        }
    }

    @GetMapping("/{lectureId}")
    public ResponseEntity<?> getLectureById(@PathVariable Long lectureId) {
        return lectureService.getLectureById(lectureId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{lectureId}")
    public ResponseEntity<?> updateLecture(@PathVariable Long lectureId,
                                                 @RequestBody LectureRequest req) {
        try {
            String result = lectureService.updateLecture(lectureId, req);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating lecture: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{lectureId}")
    public ResponseEntity<?> deleteLecture(@PathVariable Long lectureId) {
        try {
            String result = lectureService.deleteLecture(lectureId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting lecture: " + e.getMessage());
        }
    }
}