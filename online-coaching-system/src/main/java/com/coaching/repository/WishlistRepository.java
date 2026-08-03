package com.coaching.repository;

import com.coaching.entities.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    
    Optional<Wishlist> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    
    List<Wishlist> findByStudent_StudentId(Integer studentId);
    
    List<Wishlist> findByCourse_CourseId(Integer courseId);
}
