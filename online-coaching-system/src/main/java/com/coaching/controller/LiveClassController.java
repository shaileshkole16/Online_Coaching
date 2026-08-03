package com.coaching.controller;

import com.coaching.dto.LiveClassRequest;
import com.coaching.dto.LiveClassResponse;
import com.coaching.service.LiveClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/live-classes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LiveClassController {
    
    private final LiveClassService liveClassService;
    
    @PostMapping("/create")
    public ResponseEntity<LiveClassResponse> createLiveClass(@RequestBody LiveClassRequest request) {
        return ResponseEntity.ok(liveClassService.createLiveClass(request));
    }
    
    @PutMapping("/{liveClassId}")
    public ResponseEntity<LiveClassResponse> updateLiveClass(
        @PathVariable Integer liveClassId,
        @RequestBody LiveClassRequest request
    ) {
        return ResponseEntity.ok(liveClassService.updateLiveClass(liveClassId, request));
    }
    
    @GetMapping("/{liveClassId}")
    public ResponseEntity<LiveClassResponse> getLiveClass(@PathVariable Integer liveClassId) {
        return ResponseEntity.ok(liveClassService.getLiveClass(liveClassId));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LiveClassResponse>> getCourseLiveClasses(@PathVariable Integer courseId) {
        return ResponseEntity.ok(liveClassService.getCourseLiveClasses(courseId));
    }
    
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<LiveClassResponse>> getTeacherLiveClasses(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(liveClassService.getTeacherLiveClasses(teacherId));
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<LiveClassResponse>> getUpcomingClasses() {
        return ResponseEntity.ok(liveClassService.getUpcomingClasses());
    }
    
    @GetMapping("/course/{courseId}/upcoming")
    public ResponseEntity<List<LiveClassResponse>> getUpcomingByCourse(@PathVariable Integer courseId) {
        return ResponseEntity.ok(liveClassService.getUpcomingByCourse(courseId));
    }
    
    @PostMapping("/{liveClassId}/start")
    public ResponseEntity<LiveClassResponse> startLiveClass(@PathVariable Integer liveClassId) {
        return ResponseEntity.ok(liveClassService.startLiveClass(liveClassId));
    }
    
    @PostMapping("/{liveClassId}/end")
    public ResponseEntity<LiveClassResponse> endLiveClass(
        @PathVariable Integer liveClassId,
        @RequestParam(required = false) String recordingUrl
    ) {
        return ResponseEntity.ok(liveClassService.endLiveClass(liveClassId, recordingUrl));
    }
    
    @PostMapping("/{liveClassId}/cancel")
    public ResponseEntity<LiveClassResponse> cancelLiveClass(@PathVariable Integer liveClassId) {
        return ResponseEntity.ok(liveClassService.cancelLiveClass(liveClassId));
    }
    
    @PostMapping("/{liveClassId}/join")
    public ResponseEntity<String> joinLiveClass(
        @PathVariable Integer liveClassId,
        @RequestParam Integer studentId
    ) {
        liveClassService.joinLiveClass(liveClassId, studentId);
        return ResponseEntity.ok("Joined live class successfully");
    }
    
    @PostMapping("/{liveClassId}/leave")
    public ResponseEntity<String> leaveLiveClass(
        @PathVariable Integer liveClassId,
        @RequestParam Integer studentId
    ) {
        liveClassService.leaveLiveClass(liveClassId, studentId);
        return ResponseEntity.ok("Left live class successfully");
    }
    
    @DeleteMapping("/{liveClassId}")
    public ResponseEntity<String> deleteLiveClass(@PathVariable Integer liveClassId) {
        liveClassService.deleteLiveClass(liveClassId);
        return ResponseEntity.ok("Live class deleted successfully");
    }
}
