package com.coaching.controller;

import com.coaching.entities.Result;
import com.coaching.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    @Autowired private ResultService resultService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateResult(@RequestParam Integer studentId,
                                                 @RequestParam Integer courseId,
                                                 @RequestParam Integer totalMarks,
                                                 @RequestParam String grade) {
        return ResponseEntity.ok(resultService.generateResult(studentId, courseId, totalMarks, grade));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Result>> getStudentResults(@PathVariable Integer studentId) {
        return ResponseEntity.ok(resultService.getStudentResults(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Result>> getCourseResults(@PathVariable Integer courseId) {
        return ResponseEntity.ok(resultService.getCourseResults(courseId));
    }

    @GetMapping("/{resultId}")
    public ResponseEntity<?> getResultById(@PathVariable Integer resultId) {
        return resultService.getResultById(resultId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{resultId}")
    public ResponseEntity<String> updateResult(@PathVariable Integer resultId,
                                               @RequestParam(required = false) Integer totalMarks,
                                               @RequestParam(required = false) String grade) {
        return ResponseEntity.ok(resultService.updateResult(resultId, totalMarks, grade));
    }

    @DeleteMapping("/delete/{resultId}")
    public ResponseEntity<String> deleteResult(@PathVariable Integer resultId) {
        return ResponseEntity.ok(resultService.deleteResult(resultId));
    }
}
