package com.coaching.controller;

import com.coaching.dto.RatingRequest;
import com.coaching.entities.Rating;
import com.coaching.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    @Autowired private RatingService ratingService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitRating(@RequestBody RatingRequest req) {
        return ResponseEntity.ok(ratingService.submitRating(req.getStudentId(), req.getTeacherId(), req.getRating(), req.getComment()));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Rating>> getTeacherRatings(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(ratingService.getTeacherRatings(teacherId));
    }

    @GetMapping("/student/{studentId}/teacher/{teacherId}")
    public ResponseEntity<?> getStudentRatingForTeacher(@PathVariable Integer studentId, @PathVariable Integer teacherId) {
        return ratingService.getStudentRatingForTeacher(studentId, teacherId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(ratingService.calculateAverageRating(teacherId));
    }

    @PutMapping("/update/{ratingId}")
    public ResponseEntity<String> updateRating(@PathVariable Integer ratingId, @RequestBody RatingRequest req) {
        return ResponseEntity.ok(ratingService.updateRating(ratingId, req.getRating(), req.getComment()));
    }

    @DeleteMapping("/delete/{ratingId}")
    public ResponseEntity<String> deleteRating(@PathVariable Integer ratingId) {
        return ResponseEntity.ok(ratingService.deleteRating(ratingId));
    }
}
