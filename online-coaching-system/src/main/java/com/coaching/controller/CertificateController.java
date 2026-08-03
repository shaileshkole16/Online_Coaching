package com.coaching.controller;

import com.coaching.dto.CertificateRequest;
import com.coaching.dto.CertificateResponse;
import com.coaching.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificateController {
    
    private final CertificateService certificateService;
    
    @PostMapping("/issue")
    public ResponseEntity<CertificateResponse> issueCertificate(@RequestBody CertificateRequest request) {
        return ResponseEntity.ok(certificateService.issueCertificate(request));
    }
    
    @PutMapping("/{certificateId}")
    public ResponseEntity<CertificateResponse> updateCertificate(
        @PathVariable Integer certificateId,
        @RequestBody CertificateRequest request
    ) {
        return ResponseEntity.ok(certificateService.updateCertificate(certificateId, request));
    }
    
    @GetMapping("/{certificateId}")
    public ResponseEntity<CertificateResponse> getCertificate(@PathVariable Integer certificateId) {
        return ResponseEntity.ok(certificateService.getCertificate(certificateId));
    }
    
    @GetMapping("/number/{certificateNumber}")
    public ResponseEntity<CertificateResponse> getCertificateByNumber(@PathVariable String certificateNumber) {
        return ResponseEntity.ok(certificateService.getCertificateByNumber(certificateNumber));
    }
    
    @GetMapping("/verify/{verificationCode}")
    public ResponseEntity<CertificateResponse> verifyCertificate(@PathVariable String verificationCode) {
        return ResponseEntity.ok(certificateService.verifyCertificate(verificationCode));
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CertificateResponse>> getStudentCertificates(@PathVariable Integer studentId) {
        return ResponseEntity.ok(certificateService.getStudentCertificates(studentId));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CertificateResponse>> getCourseCertificates(@PathVariable Integer courseId) {
        return ResponseEntity.ok(certificateService.getCourseCertificates(courseId));
    }
    
    @PostMapping("/{certificateId}/revoke")
    public ResponseEntity<String> revokeCertificate(@PathVariable Integer certificateId) {
        certificateService.revokeCertificate(certificateId);
        return ResponseEntity.ok("Certificate revoked successfully");
    }
    
    @DeleteMapping("/{certificateId}")
    public ResponseEntity<String> deleteCertificate(@PathVariable Integer certificateId) {
        certificateService.deleteCertificate(certificateId);
        return ResponseEntity.ok("Certificate deleted successfully");
    }
}
