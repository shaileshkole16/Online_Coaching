package com.coaching.service;

import com.coaching.dto.CertificateRequest;
import com.coaching.dto.CertificateResponse;
import com.coaching.entities.Certificate;
import com.coaching.entities.Certificate.CertificateStatus;
import com.coaching.repository.CertificateRepository;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {
    
    private final CertificateRepository certificateRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    
    public CertificateResponse issueCertificate(CertificateRequest request) {
        Certificate certificate = new Certificate();
        certificate.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
        certificate.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow());
        certificate.setIssueDate(request.getIssueDate() != null ? request.getIssueDate() : LocalDate.now());
        certificate.setExpiryDate(request.getExpiryDate());
        certificate.setGrade(request.getGrade());
        certificate.setPercentage(request.getPercentage());
        certificate.setStatus(CertificateStatus.ACTIVE);
        
        certificate = certificateRepository.save(certificate);
        return convertToResponse(certificate);
    }
    
    public CertificateResponse updateCertificate(Integer certificateId, CertificateRequest request) {
        Certificate certificate = certificateRepository.findById(certificateId).orElseThrow();
        certificate.setExpiryDate(request.getExpiryDate());
        certificate.setGrade(request.getGrade());
        certificate.setPercentage(request.getPercentage());
        certificate.setStatus(CertificateStatus.valueOf(request.getStatus()));
        
        certificate = certificateRepository.save(certificate);
        return convertToResponse(certificate);
    }
    
    public CertificateResponse getCertificate(Integer certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId).orElseThrow();
        return convertToResponse(certificate);
    }
    
    public CertificateResponse getCertificateByNumber(String certificateNumber) {
        Certificate certificate = certificateRepository.findByCertificateNumber(certificateNumber).orElseThrow();
        return convertToResponse(certificate);
    }
    
    public CertificateResponse verifyCertificate(String verificationCode) {
        Certificate certificate = certificateRepository.findByVerificationCode(verificationCode).orElseThrow();
        
        // Check if certificate is valid
        if (certificate.getStatus() == CertificateStatus.REVOKED) {
            throw new RuntimeException("Certificate has been revoked");
        }
        if (certificate.getExpiryDate() != null && certificate.getExpiryDate().isBefore(LocalDate.now())) {
            certificate.setStatus(CertificateStatus.EXPIRED);
            certificateRepository.save(certificate);
        }
        
        return convertToResponse(certificate);
    }
    
    public List<CertificateResponse> getStudentCertificates(Integer studentId) {
        List<Certificate> certificates = certificateRepository.findByStudent_StudentId(studentId);
        return certificates.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<CertificateResponse> getCourseCertificates(Integer courseId) {
        List<Certificate> certificates = certificateRepository.findByCourse_CourseId(courseId);
        return certificates.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public void revokeCertificate(Integer certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId).orElseThrow();
        certificate.setStatus(CertificateStatus.REVOKED);
        certificateRepository.save(certificate);
    }
    
    public void deleteCertificate(Integer certificateId) {
        certificateRepository.deleteById(certificateId);
    }
    
    private CertificateResponse convertToResponse(Certificate certificate) {
        CertificateResponse response = new CertificateResponse();
        response.setId(certificate.getId());
        response.setStudentId(certificate.getStudent().getStudentId());
        response.setStudentName(certificate.getStudent().getUser().getName());
        response.setCourseId(certificate.getCourse().getCourseId());
        response.setCourseName(certificate.getCourse().getTitle());
        response.setCertificateNumber(certificate.getCertificateNumber());
        response.setIssueDate(certificate.getIssueDate());
        response.setExpiryDate(certificate.getExpiryDate());
        response.setStatus(certificate.getStatus().name());
        response.setGrade(certificate.getGrade());
        response.setPercentage(certificate.getPercentage());
        response.setCertificateUrl(certificate.getCertificateUrl());
        response.setVerificationCode(certificate.getVerificationCode());
        response.setIssuedBy(certificate.getIssuedBy() != null ? certificate.getIssuedBy().getName() : null);
        response.setCreatedAt(certificate.getCreatedAt().toString());
        return response;
    }
}
