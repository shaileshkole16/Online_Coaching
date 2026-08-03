package com.coaching.service;


import com.coaching.repository.StudentRepository;
import com.coaching.repository.WishlistRepository;
import com.coaching.dto.WishlistRequest;
import com.coaching.dto.WishlistResponse;
import com.coaching.entities.Wishlist;
import com.coaching.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {
    
    private final WishlistRepository wishlistRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    
    public WishlistResponse addToWishlist(WishlistRequest request) {
        if (wishlistRepository.findByStudent_StudentIdAndCourse_CourseId(
            request.getStudentId(), request.getCourseId()
        ).isPresent()) {
            throw new RuntimeException("Course already in wishlist");
        }
        
        Wishlist wishlist = new Wishlist();
        wishlist.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
        wishlist.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow());
        
        wishlist = wishlistRepository.save(wishlist);
        return convertToResponse(wishlist);
    }
    
    public WishlistResponse getWishlistItem(Integer wishlistId) {
        Wishlist wishlist = wishlistRepository.findById(wishlistId).orElseThrow();
        return convertToResponse(wishlist);
    }
    
    public List<WishlistResponse> getStudentWishlist(Integer studentId) {
        List<Wishlist> wishlist = wishlistRepository.findByStudent_StudentId(studentId);
        return wishlist.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<WishlistResponse> getCourseWishlist(Integer courseId) {
        List<Wishlist> wishlist = wishlistRepository.findByCourse_CourseId(courseId);
        return wishlist.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public void removeFromWishlist(Integer studentId, Integer courseId) {
        Wishlist wishlist = wishlistRepository.findByStudent_StudentIdAndCourse_CourseId(
            studentId, courseId
        ).orElseThrow();
        wishlistRepository.delete(wishlist);
    }
    
    public void deleteWishlistItem(Integer wishlistId) {
        wishlistRepository.deleteById(wishlistId);
    }
    
    private WishlistResponse convertToResponse(Wishlist wishlist) {
        WishlistResponse response = new WishlistResponse();
        response.setId(wishlist.getId());
        response.setStudentId(wishlist.getStudent().getStudentId());
        response.setStudentName(wishlist.getStudent().getUser().getName());
        response.setCourseId(wishlist.getCourse().getCourseId());
        response.setCourseName(wishlist.getCourse().getTitle());
        response.setCourseDescription(wishlist.getCourse().getDescription());
        response.setCoursePrice(wishlist.getCourse().getPrice() != null ? wishlist.getCourse().getPrice().doubleValue() : null);
        response.setCourseLevel(wishlist.getCourse().getLevel());
        response.setCourseDuration(wishlist.getCourse().getDuration());
        response.setTeacherId(wishlist.getCourse().getTeacher().getTeacherId());
        response.setTeacherName(wishlist.getCourse().getTeacher().getUser().getName());
        response.setAddedAt(wishlist.getAddedAt());
        return response;
    }
}
