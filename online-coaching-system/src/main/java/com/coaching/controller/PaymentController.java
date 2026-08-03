package com.coaching.controller;


import com.coaching.dto.PaymentRequest;
import com.coaching.dto.PaymentResponse;
import com.coaching.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createOrder(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature) {
        return ResponseEntity.ok(paymentService.verifyPayment(orderId, paymentId, signature));
    }

    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<PaymentResponse> processRefund(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.processRefund(paymentId));
    }

    @GetMapping("/status/{paymentId}")
    public ResponseEntity<PaymentResponse> getPaymentStatus(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(paymentId));
    }
}
