package com.coaching.controller;

import com.coaching.entities.Enrollment;
import com.coaching.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired private EnrollmentService enrollmentService;

    @PostMapping("/enroll")
    public ResponseEntity<String> enrollStudent(@RequestParam Integer studentId, @RequestParam Integer courseId) {
        return ResponseEntity.ok(enrollmentService.enrollStudent(studentId, courseId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>> getStudentEnrollments(@PathVariable Integer studentId) {
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getCourseStudents(@PathVariable Integer courseId) {
        return ResponseEntity.ok(enrollmentService.getCourseStudents(courseId));
    }

    @DeleteMapping("/cancel/{enrollmentId}")
    public ResponseEntity<String> cancelEnrollment(@PathVariable Integer enrollmentId) {
        return ResponseEntity.ok(enrollmentService.cancelEnrollment(enrollmentId));
    }

    @GetMapping("/{enrollmentId}")
    public ResponseEntity<?> getEnrollmentById(@PathVariable Integer enrollmentId) {
        return enrollmentService.getEnrollmentById(enrollmentId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
