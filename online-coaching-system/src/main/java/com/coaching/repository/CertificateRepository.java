package com.coaching.repository;

import com.coaching.entities.Certificate;
import com.coaching.entities.Certificate.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
    
    Optional<Certificate> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    
    List<Certificate> findByStudent_StudentId(Integer studentId);
    
    List<Certificate> findByCourse_CourseId(Integer courseId);
    
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    
    Optional<Certificate> findByVerificationCode(String verificationCode);
    
    List<Certificate> findByStatus(CertificateStatus status);
    
    @Query("SELECT c FROM Certificate c WHERE c.student.studentId = :studentId AND c.status = 'ACTIVE'")
    List<Certificate> findActiveByStudent(@Param("studentId") Integer studentId);
    
    @Query("SELECT c FROM Certificate c WHERE c.expiryDate < CURRENT_DATE AND c.status = 'ACTIVE'")
    List<Certificate> findExpiredCertificates();
}
