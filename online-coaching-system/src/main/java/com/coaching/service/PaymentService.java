package com.coaching.service;

import com.coaching.dto.PaymentRequest;
import com.coaching.dto.PaymentResponse;
import com.coaching.entities.Course;
import com.coaching.entities.Enrollment;
import com.coaching.entities.Payment;
import com.coaching.entities.Student;
import com.coaching.repository.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Transactional
    public PaymentResponse createOrder(PaymentRequest request) {
        try {
            // Validate student and course
            Optional<Student> studentOpt = studentRepository.findById(request.getStudentId());
            if (studentOpt.isEmpty()) {
                return new PaymentResponse(null, null, null, null, null, "FAILED", null, "Student not found", null, null);
            }

            Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());
            if (courseOpt.isEmpty()) {
                return new PaymentResponse(null, null, null, null, null, "FAILED", null, "Course not found", null, null);
            }

            // Check if already enrolled
            Optional<Enrollment> existingEnrollment = enrollmentRepository.findByStudent_StudentIdAndCourse_CourseId(request.getStudentId(), request.getCourseId());
            if (existingEnrollment.isPresent()) {
                return new PaymentResponse(null, null, null, null, null, "FAILED", null, "Already enrolled in this course", null, null);
            }

            // Create Razorpay order
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount() * 100); // Amount in paise
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", request.getReceipt());
            orderRequest.put("notes", new JSONObject().put("courseId", request.getCourseId())
                .put("studentId", request.getStudentId())
                .put("planType", request.getPlanType()));
            
            Order order = razorpay.orders.create(orderRequest);
            
            // Create pending payment record
            Payment payment = Payment.builder()
                .razorpayOrderId(order.get("id"))
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .status("PENDING")
                .paymentMethod("RAZORPAY")
                .student(studentOpt.get())
                .course(courseOpt.get())
                .planType(request.getPlanType())
                .receipt(request.getReceipt())
                .notes(request.getNotes())
                .build();
            
            payment = paymentRepository.save(payment);

            return new PaymentResponse(
                payment.getId(),
                order.get("id"),
                null,
                request.getAmount(),
                request.getCurrency(),
                "PENDING",
                request.getPlanType(),
                "Order created successfully",
                request.getStudentId(),
                request.getCourseId()
            );

        } catch (RazorpayException e) {
            return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                "Razorpay error: " + e.getMessage(), null, null);
        } catch (Exception e) {
            return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                "Error creating order: " + e.getMessage(), null, null);
        }
    }

    @Transactional
    public PaymentResponse verifyPayment(String orderId, String paymentId, String signature) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderId(orderId);
            if (paymentOpt.isEmpty()) {
                return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                    "Payment order not found", null, null);
            }

            Payment payment = paymentOpt.get();

            // Verify signature
            String generatedSignature = generateSignature(orderId, paymentId);
            if (!generatedSignature.equals(signature)) {
                payment.setStatus("FAILED");
                paymentRepository.save(payment);
                return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                    "Invalid payment signature", null, null);
            }

            // Update payment status
            payment.setRazorpayPaymentId(paymentId);
            payment.setRazorpaySignature(signature);
            payment.setStatus("COMPLETED");
            payment = paymentRepository.save(payment);

            // Create enrollment
            Enrollment enrollment = Enrollment.builder()
                .student(payment.getStudent())
                .course(payment.getCourse())
                .enrollmentDate(LocalDateTime.now())
                .planType(payment.getPlanType())
                .amountPaid(payment.getAmount())
                .build();
            
            enrollmentRepository.save(enrollment);

            return new PaymentResponse(
                payment.getId(),
                orderId,
                paymentId,
                payment.getAmount(),
                payment.getCurrency(),
                "COMPLETED",
                payment.getPlanType(),
                "Payment verified and enrollment successful",
                payment.getStudent().getStudentId(),
                payment.getCourse().getCourseId()
            );

        } catch (Exception e) {
            return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                "Error verifying payment: " + e.getMessage(), null, null);
        }
    }

    private String generateSignature(String orderId, String paymentId) {
        try {
            String data = orderId + "|" + paymentId;
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            mac.init(new javax.crypto.spec.SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes());
            return java.util.Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error generating signature", e);
        }
    }

    @Transactional
    public PaymentResponse processRefund(Long paymentId) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findById(paymentId.intValue());
            if (paymentOpt.isEmpty()) {
                return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                    "Payment not found", null, null);
            }

            Payment payment = paymentOpt.get();

            if (!payment.getStatus().equals("COMPLETED")) {
                return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                    "Cannot refund non-completed payment", null, null);
            }

            if (payment.getRefundStatus() != null && !payment.getRefundStatus().equals("NONE")) {
                return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                    "Refund already processed", null, null);
            }

            // Process refund with Razorpay
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", payment.getAmount() * 100); // Amount in paise
            
            com.razorpay.Refund refund = razorpay.payments.refund(payment.getRazorpayPaymentId(), refundRequest);

            // Update payment record
            payment.setRefundId(refund.get("id"));
            payment.setRefundAmount(payment.getAmount());
            payment.setRefundStatus("PROCESSED");
            payment.setRefundCreatedAt(LocalDateTime.now());
            payment = paymentRepository.save(payment);

            // Remove enrollment
            Optional<Enrollment> enrollmentOpt = enrollmentRepository
                .findByStudent_StudentIdAndCourse_CourseId(
                    payment.getStudent().getStudentId(), 
                    payment.getCourse().getCourseId()
                );
            enrollmentOpt.ifPresent(enrollmentRepository::delete);

            return new PaymentResponse(
                payment.getId(),
                payment.getRazorpayOrderId(),
                payment.getRazorpayPaymentId(),
                payment.getAmount(),
                payment.getCurrency(),
                "REFUNDED",
                payment.getPlanType(),
                "Refund processed successfully",
                payment.getStudent().getStudentId(),
                payment.getCourse().getCourseId()
            );

        } catch (RazorpayException e) {
            return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                "Razorpay refund error: " + e.getMessage(), null, null);
        } catch (Exception e) {
            return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                "Error processing refund: " + e.getMessage(), null, null);
        }
    }

    public PaymentResponse getPaymentStatus(Long paymentId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId.intValue());
        if (paymentOpt.isEmpty()) {
            return new PaymentResponse(null, null, null, null, null, "FAILED", null, 
                "Payment not found", null, null);
        }

        Payment payment = paymentOpt.get();
        return new PaymentResponse(
            payment.getId(),
            payment.getRazorpayOrderId(),
            payment.getRazorpayPaymentId(),
            payment.getAmount(),
            payment.getCurrency(),
            payment.getStatus(),
            payment.getPlanType(),
            "Payment status retrieved",
            payment.getStudent().getStudentId(),
            payment.getCourse().getCourseId()
        );
    }
}
