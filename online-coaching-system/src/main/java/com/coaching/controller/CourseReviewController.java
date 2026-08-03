package com.coaching.controller;

import com.coaching.dto.CourseReviewRequest;
import com.coaching.dto.CourseReviewResponse;
import com.coaching.service.CourseReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course-reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourseReviewController {
    
    private final CourseReviewService courseReviewService;
    
    @PostMapping("/create")
    public ResponseEntity<CourseReviewResponse> createReview(@RequestBody CourseReviewRequest request) {
        return ResponseEntity.ok(courseReviewService.createReview(request));
    }
    
    @PutMapping("/{reviewId}")
    public ResponseEntity<CourseReviewResponse> updateReview(
        @PathVariable Integer reviewId,
        @RequestBody CourseReviewRequest request
    ) {
        return ResponseEntity.ok(courseReviewService.updateReview(reviewId, request));
    }
    
    @GetMapping("/{reviewId}")
    public ResponseEntity<CourseReviewResponse> getReview(@PathVariable Integer reviewId) {
        return ResponseEntity.ok(courseReviewService.getReview(reviewId));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseReviewResponse>> getCourseReviews(@PathVariable Integer courseId) {
        return ResponseEntity.ok(courseReviewService.getCourseReviews(courseId));
    }
    
    @PostMapping("/{reviewId}/verify")
    public ResponseEntity<Void> markAsVerified(@PathVariable Integer reviewId) {
        courseReviewService.markAsVerified(reviewId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{reviewId}/helpful")
    public ResponseEntity<Void> markAsHelpful(@PathVariable Integer reviewId) {
        courseReviewService.markAsHelpful(reviewId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer reviewId) {
        courseReviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/course/{courseId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Integer courseId) {
        return ResponseEntity.ok(courseReviewService.getAverageRating(courseId));
    }
    
    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> getReviewCount(@PathVariable Integer courseId) {
        return ResponseEntity.ok(courseReviewService.getReviewCount(courseId));
    }
}
