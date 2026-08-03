package com.coaching.controller;

import com.coaching.dto.AssignmentRequest;
import com.coaching.entities.Assignment;
import com.coaching.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired private AssignmentService assignmentService;

    @PostMapping("/create")
    public ResponseEntity<String> createAssignment(@RequestBody AssignmentRequest req) {
        return ResponseEntity.ok(assignmentService.createAssignment(req));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Assignment>> getCourseAssignments(@PathVariable Integer courseId) {
        return ResponseEntity.ok(assignmentService.getCourseAssignments(courseId));
    }

    @GetMapping("/course/{courseId}/student/{studentId}")
    public ResponseEntity<?> getCourseAssignmentsForStudent(@PathVariable Integer courseId, @PathVariable Integer studentId) {
        return ResponseEntity.ok(assignmentService.getCourseAssignmentsForStudent(courseId, studentId));
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<?> getAssignmentById(@PathVariable Integer assignmentId) {
        return assignmentService.getAssignmentById(assignmentId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{assignmentId}")
    public ResponseEntity<String> updateAssignment(@PathVariable Integer assignmentId,
                                                   @RequestBody AssignmentRequest req) {
        return ResponseEntity.ok(assignmentService.updateAssignment(assignmentId, req));
    }

    @DeleteMapping("/delete/{assignmentId}")
    public ResponseEntity<String> deleteAssignment(@PathVariable Integer assignmentId) {
        return ResponseEntity.ok(assignmentService.deleteAssignment(assignmentId));
    }
}
