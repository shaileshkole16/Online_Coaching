package com.coaching.controller;

import com.coaching.dto.AdminDashboardResponse;
import com.coaching.dto.AuthResponse;
import com.coaching.dto.StudentResponse;
import com.coaching.dto.TeacherResponse;
import com.coaching.dto.EnrollmentManagementResponse;
import com.coaching.entities.PlatformSettings;
import com.coaching.service.AdminService;
import com.coaching.service.PlatformSettingsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PlatformSettingsService platformSettingsService;

    // ✅ Admin Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    // ✅ Get Analytics
    @GetMapping("/analytics")
    public ResponseEntity<AdminDashboardResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    // ✅ Get All Students (Manage Users)
    @GetMapping("/students")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    // ✅ Get All Teachers (Manage Users)
    @GetMapping("/teachers")
    public ResponseEntity<List<TeacherResponse>> getAllTeachers() {
        return ResponseEntity.ok(adminService.getAllTeachers());
    }

    // ✅ Block/Delete Student
    @DeleteMapping("/block/student/{id}")
    public ResponseEntity<AuthResponse> blockStudent(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.deleteStudent(id)) ;
    }

    // ✅ Block/Delete Teacher
    @DeleteMapping("/block/teacher/{id}")
    public ResponseEntity<AuthResponse> blockTeacher(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.deleteTeacher(id));
    }

    // ✅ Get Platform Settings
    @GetMapping("/settings")
    public ResponseEntity<PlatformSettings> getSettings() {
        return ResponseEntity.ok(platformSettingsService.getSettings());
    }

    // ✅ Update Platform Settings
    @PutMapping("/settings")
    public ResponseEntity<PlatformSettings> updateSettings(@RequestBody PlatformSettings settings) {
        return ResponseEntity.ok(platformSettingsService.updateSettings(settings));
    }

    // ✅ Get All Courses for Admin
    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses() {
        try {
            return ResponseEntity.ok(adminService.getAllCourses());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching courses: " + e.getMessage());
        }
    }

    // ✅ Approve Course
    @PutMapping("/courses/{courseId}/approve")
    public ResponseEntity<?> approveCourse(@PathVariable Integer courseId) {
        try {
            return ResponseEntity.ok(adminService.approveCourse(courseId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error approving course: " + e.getMessage());
        }
    }

    // ✅ Reject Course
    @PutMapping("/courses/{courseId}/reject")
    public ResponseEntity<?> rejectCourse(@PathVariable Integer courseId) {
        try {
            return ResponseEntity.ok(adminService.rejectCourse(courseId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error rejecting course: " + e.getMessage());
        }
    }

    // ✅ Get All Enrollments for Management
    @GetMapping("/enrollments")
    public ResponseEntity<List<EnrollmentManagementResponse>> getAllEnrollments() {
        try {
            return ResponseEntity.ok(adminService.getAllEnrollments());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Collections.emptyList());
        }
    }
}