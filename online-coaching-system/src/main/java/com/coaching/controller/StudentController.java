package com.coaching.controller;

import com.coaching.entities.Student;
import com.coaching.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired private StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<?> getStudentById(@PathVariable Integer studentId) {
        return studentService.getStudentById(studentId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{studentId}")
    public ResponseEntity<String> updateStudent(@PathVariable Integer studentId,
                                                @RequestBody Student studentData) {
        return ResponseEntity.ok(studentService.updateStudent(studentId, studentData));
    }

    @DeleteMapping("/delete/{studentId}")
    public ResponseEntity<String> deleteStudent(@PathVariable Integer studentId) {
        return ResponseEntity.ok(studentService.deleteStudent(studentId));
    }

    @GetMapping("/dashboard/{studentId}")
    public ResponseEntity<?> getStudentDashboard(@PathVariable Integer studentId) {
        Object dashboard = studentService.getStudentDashboard(studentId);
        if (dashboard instanceof String) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/user/{userId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> getStudentByUserId(@PathVariable Integer userId) {
        Object result = studentService.getStudentByUserId(userId);
        if (result instanceof java.util.Optional) {
            java.util.Optional<?> opt = (java.util.Optional<?>) result;
            return opt.<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.ok(result);
    }
}
