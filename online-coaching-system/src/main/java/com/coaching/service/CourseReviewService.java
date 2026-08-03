package com.coaching.service;

import com.coaching.dto.CourseReviewRequest;
import com.coaching.dto.CourseReviewResponse;
import com.coaching.entities.CourseReview;
import com.coaching.repository.CourseReviewRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseReviewService {
    
    private final CourseReviewRepository courseReviewRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    
    public CourseReviewResponse createReview(CourseReviewRequest request) {
        CourseReview review = new CourseReview();
        review.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow());
        review.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText());
        
        review = courseReviewRepository.save(review);
        return convertToResponse(review);
    }
    
    public CourseReviewResponse updateReview(Integer reviewId, CourseReviewRequest request) {
        CourseReview review = courseReviewRepository.findById(reviewId).orElseThrow();
        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText());
        
        review = courseReviewRepository.save(review);
        return convertToResponse(review);
    }
    
    public CourseReviewResponse getReview(Integer reviewId) {
        CourseReview review = courseReviewRepository.findById(reviewId).orElseThrow();
        return convertToResponse(review);
    }
    
    public List<CourseReviewResponse> getCourseReviews(Integer courseId) {
        List<CourseReview> reviews = courseReviewRepository.findByCourse_CourseId(courseId);
        return reviews.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public void markAsVerified(Integer reviewId) {
        CourseReview review = courseReviewRepository.findById(reviewId).orElseThrow();
        review.setIsVerified(true);
        courseReviewRepository.save(review);
    }
    
    public void markAsHelpful(Integer reviewId) {
        CourseReview review = courseReviewRepository.findById(reviewId).orElseThrow();
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        courseReviewRepository.save(review);
    }
    
    public void deleteReview(Integer reviewId) {
        courseReviewRepository.deleteById(reviewId);
    }
    
    public Double getAverageRating(Integer courseId) {
        return courseReviewRepository.getAverageRatingByCourse(courseId);
    }
    
    public Long getReviewCount(Integer courseId) {
        return courseReviewRepository.getReviewCountByCourse(courseId);
    }
    
    private CourseReviewResponse convertToResponse(CourseReview review) {
        CourseReviewResponse response = new CourseReviewResponse();
        response.setId(review.getId());
        response.setCourseId(review.getCourse().getCourseId());
        response.setCourseName(review.getCourse().getTitle());
        response.setStudentId(review.getStudent().getStudentId());
        response.setStudentName(review.getStudent().getUser().getName());
        response.setRating(review.getRating());
        response.setReviewText(review.getReviewText());
        response.setIsVerified(review.getIsVerified());
        response.setHelpfulCount(review.getHelpfulCount());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        return response;
    }
}
