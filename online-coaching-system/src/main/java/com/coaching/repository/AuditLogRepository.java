package com.coaching.repository;

import com.coaching.entities.AuditLog;
import com.coaching.entities.AuditLog.AuditAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
    
    List<AuditLog> findByUser_UserId(Integer userId);
    
    List<AuditLog> findByAction(AuditAction action);
    
    List<AuditLog> findByEntityType(String entityType);
    
    @Query("SELECT al FROM AuditLog al WHERE al.createdAt BETWEEN :start AND :end ORDER BY al.createdAt DESC")
    List<AuditLog> findByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT al FROM AuditLog al WHERE al.action = :action AND al.createdAt BETWEEN :start AND :end ORDER BY al.createdAt DESC")
    List<AuditLog> findByActionAndDateRange(@Param("action") AuditAction action, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
