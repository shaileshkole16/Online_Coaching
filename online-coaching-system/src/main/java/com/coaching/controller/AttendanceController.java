package com.coaching.controller;

import com.coaching.dto.AttendanceRequest;
import com.coaching.dto.AttendanceResponse;
import com.coaching.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    @PostMapping("/mark")
    public ResponseEntity<AttendanceResponse> markAttendance(@RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.markAttendance(request));
    }
    
    @PutMapping("/{attendanceId}")
    public ResponseEntity<AttendanceResponse> updateAttendance(
        @PathVariable Integer attendanceId,
        @RequestBody AttendanceRequest request
    ) {
        return ResponseEntity.ok(attendanceService.updateAttendance(attendanceId, request));
    }
    
    @GetMapping("/{attendanceId}")
    public ResponseEntity<AttendanceResponse> getAttendance(@PathVariable Integer attendanceId) {
        return ResponseEntity.ok(attendanceService.getAttendance(attendanceId));
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceResponse>> getStudentAttendance(
        @PathVariable Integer studentId,
        @RequestParam(required = false) LocalDate startDate,
        @RequestParam(required = false) LocalDate endDate
    ) {
        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId, startDate, endDate));
        }
        return ResponseEntity.ok(attendanceService.getStudentAttendance(
            studentId, 
            LocalDate.now().minusDays(30), 
            LocalDate.now()
        ));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AttendanceResponse>> getCourseAttendance(
        @PathVariable Integer courseId,
        @RequestParam(required = false) LocalDate startDate,
        @RequestParam(required = false) LocalDate endDate
    ) {
        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(attendanceService.getCourseAttendance(courseId, startDate, endDate));
        }
        return ResponseEntity.ok(attendanceService.getCourseAttendance(
            courseId, 
            LocalDate.now().minusDays(30), 
            LocalDate.now()
        ));
    }
    
    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<AttendanceResponse>> getStudentCourseAttendance(
        @PathVariable Integer studentId,
        @PathVariable Integer courseId
    ) {
        return ResponseEntity.ok(attendanceService.getStudentCourseAttendance(studentId, courseId));
    }
    
    @PostMapping("/bulk")
    public ResponseEntity<String> markBulkAttendance(@RequestBody List<AttendanceRequest> requests) {
        attendanceService.markBulkAttendance(requests);
        return ResponseEntity.ok("Bulk attendance marked successfully");
    }
    
    @DeleteMapping("/{attendanceId}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Integer attendanceId) {
        attendanceService.deleteAttendance(attendanceId);
        return ResponseEntity.ok("Attendance deleted successfully");
    }
}
