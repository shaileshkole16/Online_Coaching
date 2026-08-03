package com.coaching.repository;

import com.coaching.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    
    Optional<Payment> findByRazorpayOrderId(String orderId);
    
    Optional<Payment> findByRazorpayPaymentId(String paymentId);
    
    List<Payment> findByStudent_StudentId(Integer studentId);
    
    List<Payment> findByCourse_CourseId(Integer courseId);
    
    Optional<Payment> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    
    List<Payment> findByStatus(String status);
    
    List<Payment> findByStudent_StudentIdAndStatus(Integer studentId, String status);
}
