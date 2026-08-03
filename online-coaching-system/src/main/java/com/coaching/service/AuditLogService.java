package com.coaching.service;

import com.coaching.dto.AuditLogRequest;
import com.coaching.dto.AuditLogResponse;
import com.coaching.entities.AuditLog;
import com.coaching.entities.AuditLog.AuditAction;
import com.coaching.repository.AuditLogRepository;
import com.coaching.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    
    public AuditLogResponse createLog(AuditLogRequest request) {
        AuditLog auditLog = new AuditLog();
        if (request.getUserId() != null) {
            auditLog.setUser(userRepository.findById(request.getUserId()).orElse(null));
        }
        auditLog.setAction(AuditAction.valueOf(request.getAction()));
        auditLog.setEntityType(request.getEntityType());
        auditLog.setEntityId(request.getEntityId());
        auditLog.setOldValue(request.getOldValue());
        auditLog.setNewValue(request.getNewValue());
        auditLog.setIpAddress(request.getIpAddress());
        auditLog.setUserAgent(request.getUserAgent());
        
        auditLog = auditLogRepository.save(auditLog);
        return convertToResponse(auditLog);
    }
    
    public List<AuditLogResponse> getUserLogs(Integer userId) {
        List<AuditLog> logs = auditLogRepository.findByUser_UserId(userId);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AuditLogResponse> getActionLogs(String action) {
        List<AuditLog> logs = auditLogRepository.findByAction(AuditAction.valueOf(action));
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AuditLogResponse> getEntityLogs(String entityType) {
        List<AuditLog> logs = auditLogRepository.findByEntityType(entityType);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AuditLogResponse> getDateRangeLogs(LocalDateTime start, LocalDateTime end) {
        List<AuditLog> logs = auditLogRepository.findByDateRange(start, end);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AuditLogResponse> getAllLogs() {
        List<AuditLog> logs = auditLogRepository.findAll();
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    private AuditLogResponse convertToResponse(AuditLog log) {
        AuditLogResponse response = new AuditLogResponse();
        response.setId(log.getId());
        if (log.getUser() != null) {
            response.setUserId(log.getUser().getUserId());
            response.setUserName(log.getUser().getName());
        }
        response.setAction(log.getAction().name());
        response.setEntityType(log.getEntityType());
        response.setEntityId(log.getEntityId());
        response.setOldValue(log.getOldValue());
        response.setNewValue(log.getNewValue());
        response.setIpAddress(log.getIpAddress());
        response.setUserAgent(log.getUserAgent());
        response.setCreatedAt(log.getCreatedAt());
        return response;
    }
}
