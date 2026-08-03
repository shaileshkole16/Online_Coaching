package com.coaching.controller;

import com.coaching.dto.CourseRequest;
import com.coaching.dto.CourseResponse;
import com.coaching.entities.Course;
import com.coaching.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired private CourseService courseService;

    @PostMapping("/create")
    public ResponseEntity<String> createCourse(@RequestBody CourseRequest req) {
        return ResponseEntity.ok(courseService.createCourse(req));
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourseById(@PathVariable Integer courseId) {
        return courseService.getCourseById(courseId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<CourseResponse>> getCoursesByTeacher(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(courseService.getCoursesByTeacher(teacherId));
    }

    @PutMapping("/update/{courseId}")
    public ResponseEntity<String> updateCourse(@PathVariable Integer courseId,
                                               @RequestBody CourseRequest req) {
        return ResponseEntity.ok(courseService.updateCourse(courseId, req));
    }

    @DeleteMapping("/delete/{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable Integer courseId) {
        return ResponseEntity.ok(courseService.deleteCourse(courseId));
    }
}
