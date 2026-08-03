package com.coaching.controller;

import com.coaching.entities.Submission;
import com.coaching.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired private SubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitAssignment(@RequestParam Integer assignmentId,
                                                   @RequestParam Integer studentId,
                                                   @RequestParam String fileUrl) {
        return ResponseEntity.ok(submissionService.submitAssignment(assignmentId, studentId, fileUrl));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getStudentSubmissions(@PathVariable Integer studentId) {
        return ResponseEntity.ok(submissionService.getStudentSubmissions(studentId));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getAssignmentSubmissions(@PathVariable Integer assignmentId) {
        return ResponseEntity.ok(submissionService.getAssignmentSubmissions(assignmentId));
    }

    @PutMapping("/grade/{submissionId}")
    public ResponseEntity<String> gradeSubmission(@PathVariable Integer submissionId,
                                                  @RequestParam Integer marks,
                                                  @RequestParam String feedback) {
        return ResponseEntity.ok(submissionService.gradeSubmission(submissionId, marks, feedback));
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Integer submissionId) {
        return submissionService.getSubmissionById(submissionId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
