package com.coaching.controller;

import com.coaching.dto.AuditLogRequest;
import com.coaching.dto.AuditLogResponse;
import com.coaching.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {
    
    private final AuditLogService auditLogService;
    
    @PostMapping("/create")
    public ResponseEntity<AuditLogResponse> createLog(@RequestBody AuditLogRequest request) {
        return ResponseEntity.ok(auditLogService.createLog(request));
    }
    
    @PostMapping("/sample")
    public ResponseEntity<String> createSampleLogs() {
        // Create some sample audit logs for demonstration
        auditLogService.createLog(createSampleRequest(1, "LOGIN", "USER", null, null, "127.0.0.1", "Mozilla/5.0"));
        auditLogService.createLog(createSampleRequest(1, "CREATE", "COURSE", 1, null, "127.0.0.1", "Mozilla/5.0"));
        auditLogService.createLog(createSampleRequest(1, "UPDATE", "USER", 1, "Active -> Inactive", "127.0.0.1", "Mozilla/5.0"));
        auditLogService.createLog(createSampleRequest(2, "LOGIN", "USER", null, null, "192.168.1.1", "Mozilla/5.0"));
        auditLogService.createLog(createSampleRequest(1, "APPROVE", "COURSE", 1, "Pending -> Approved", "127.0.0.1", "Mozilla/5.0"));
        return ResponseEntity.ok("Sample audit logs created successfully");
    }
    
    private AuditLogRequest createSampleRequest(Integer userId, String action, String entityType, Integer entityId, String newValue, String ipAddress, String userAgent) {
        AuditLogRequest request = new AuditLogRequest();
        request.setUserId(userId);
        request.setAction(action);
        request.setEntityType(entityType);
        request.setEntityId(entityId);
        request.setNewValue(newValue);
        request.setIpAddress(ipAddress);
        request.setUserAgent(userAgent);
        return request;
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponse>> getUserLogs(@PathVariable Integer userId) {
        return ResponseEntity.ok(auditLogService.getUserLogs(userId));
    }
    
    @GetMapping("/action/{action}")
    public ResponseEntity<List<AuditLogResponse>> getActionLogs(@PathVariable String action) {
        return ResponseEntity.ok(auditLogService.getActionLogs(action));
    }
    
    @GetMapping("/entity/{entityType}")
    public ResponseEntity<List<AuditLogResponse>> getEntityLogs(@PathVariable String entityType) {
        return ResponseEntity.ok(auditLogService.getEntityLogs(entityType));
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<AuditLogResponse>> getDateRangeLogs(
        @RequestParam LocalDateTime start,
        @RequestParam LocalDateTime end
    ) {
        return ResponseEntity.ok(auditLogService.getDateRangeLogs(start, end));
    }
    
    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }
}
