package com.coaching.controller;

import com.coaching.entities.Teacher;
import com.coaching.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "*")
public class TeacherController {

    @Autowired private TeacherService teacherService;

    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{teacherId}")
    public ResponseEntity<?> getTeacherById(@PathVariable Integer teacherId) {
        return teacherService.getTeacherById(teacherId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{teacherId}")
    public ResponseEntity<?> updateTeacher(@PathVariable Integer teacherId,
                                                @RequestBody Teacher teacherData) {
        String result = teacherService.updateTeacher(teacherId, teacherData);
        if (result.contains("not found")) {
            return ResponseEntity.status(404).body(result);
        }
        if (result.contains("already in use")) {
            return ResponseEntity.status(400).body(result);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{teacherId}")
    public ResponseEntity<String> deleteTeacher(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(teacherService.deleteTeacher(teacherId));
    }

    @GetMapping("/dashboard/{teacherId}")
    public ResponseEntity<?> getTeacherDashboard(@PathVariable Integer teacherId) {
        Object dashboard = teacherService.getTeacherDashboard(teacherId);
        if (dashboard instanceof String) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/user/{userId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> getTeacherByUserId(@PathVariable Integer userId) {
        try {
            return teacherService.getTeacherByUserId(userId)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching teacher: " + e.getMessage());
        }
    }
}
