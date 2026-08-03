package com.coaching.controller;

import com.coaching.dto.AdminDashboardResponse;
import com.coaching.dto.AuthResponse;
import com.coaching.entities.Student;
import com.coaching.entities.Teacher;
import com.coaching.service.AdminService;

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
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    // ✅ Get All Teachers (Manage Users)
    @GetMapping("/teachers")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
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
}