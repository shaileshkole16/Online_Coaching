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
@RequestMapping("/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {
    
    private final AuditLogService auditLogService;
    
    @PostMapping("/create")
    public ResponseEntity<AuditLogResponse> createLog(@RequestBody AuditLogRequest request) {
        return ResponseEntity.ok(auditLogService.createLog(request));
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
