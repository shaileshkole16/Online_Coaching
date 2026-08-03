package com.coaching.controller;

import com.coaching.entities.CourseRating;
import com.coaching.service.CourseRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-ratings")
@CrossOrigin(origins = "*")
public class CourseRatingController {

    @Autowired private CourseRatingService ratingService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitRating(@RequestBody CourseRatingRequest req) {
        return ResponseEntity.ok(ratingService.submitRating(req.getStudentId(), req.getCourseId(), req.getRating(), req.getComment()));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseRating>> getCourseRatings(@PathVariable Integer courseId) {
        return ResponseEntity.ok(ratingService.getCourseRatings(courseId));
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<?> getStudentRatingForCourse(@PathVariable Integer studentId, @PathVariable Integer courseId) {
        return ratingService.getStudentRatingForCourse(studentId, courseId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Integer courseId) {
        return ResponseEntity.ok(ratingService.calculateAverageRating(courseId));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<CourseRating>> getTeacherCourseRatings(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(ratingService.getTeacherCourseRatings(teacherId));
    }

    @PutMapping("/update/{ratingId}")
    public ResponseEntity<String> updateRating(@PathVariable Integer ratingId, @RequestBody CourseRatingRequest req) {
        return ResponseEntity.ok(ratingService.updateRating(ratingId, req.getRating(), req.getComment()));
    }

    @DeleteMapping("/delete/{ratingId}")
    public ResponseEntity<String> deleteRating(@PathVariable Integer ratingId) {
        return ResponseEntity.ok(ratingService.deleteRating(ratingId));
    }

    // DTO for request
    public static class CourseRatingRequest {
        private Integer studentId;
        private Integer courseId;
        private Integer rating;
        private String comment;

        public Integer getStudentId() { return studentId; }
        public void setStudentId(Integer studentId) { this.studentId = studentId; }
        public Integer getCourseId() { return courseId; }
        public void setCourseId(Integer courseId) { this.courseId = courseId; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}
