package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "certificate")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id")
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "certificate_number", unique = true, nullable = false)
    private String certificateNumber;
    
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;
    
    @Column(name = "expiry_date")
    private LocalDate expiryDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CertificateStatus status = CertificateStatus.ACTIVE;
    
    @Column(name = "grade")
    private String grade;
    
    @Column(name = "percentage")
    private Double percentage;
    
    @Column(name = "certificate_url")
    private String certificateUrl;
    
    @Column(name = "verification_code", unique = true)
    private String verificationCode;
    
    @ManyToOne
    @JoinColumn(name = "issued_by")
    private User issuedBy;
    
    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        if (certificateNumber == null) {
            certificateNumber = "CERT-" + System.currentTimeMillis();
        }
        if (verificationCode == null) {
            verificationCode = generateVerificationCode();
        }
    }
    
    private String generateVerificationCode() {
        return "VC-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    public enum CertificateStatus {
        ACTIVE, REVOKED, EXPIRED
    }
}
