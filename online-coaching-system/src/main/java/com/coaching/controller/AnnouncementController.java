package com.coaching.controller;

import com.coaching.dto.AnnouncementRequest;
import com.coaching.dto.AnnouncementResponse;
import com.coaching.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnnouncementController {
    
    private final AnnouncementService announcementService;
    
    @PostMapping("/create")
    public ResponseEntity<AnnouncementResponse> createAnnouncement(@RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(announcementService.createAnnouncement(request));
    }
    
    @PutMapping("/{announcementId}")
    public ResponseEntity<AnnouncementResponse> updateAnnouncement(
        @PathVariable Integer announcementId,
        @RequestBody AnnouncementRequest request
    ) {
        return ResponseEntity.ok(announcementService.updateAnnouncement(announcementId, request));
    }
    
    @GetMapping("/{announcementId}")
    public ResponseEntity<AnnouncementResponse> getAnnouncement(@PathVariable Integer announcementId) {
        return ResponseEntity.ok(announcementService.getAnnouncement(announcementId));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AnnouncementResponse>> getCourseAnnouncements(@PathVariable Integer courseId) {
        return ResponseEntity.ok(announcementService.getCourseAnnouncements(courseId));
    }
    
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<AnnouncementResponse>> getTeacherAnnouncements(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(announcementService.getTeacherAnnouncements(teacherId));
    }
    
    @GetMapping("/admin")
    public ResponseEntity<List<AnnouncementResponse>> getAdminAnnouncements() {
        return ResponseEntity.ok(announcementService.getAdminAnnouncements());
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AnnouncementResponse>> getStudentAnnouncements(@PathVariable Integer studentId) {
        return ResponseEntity.ok(announcementService.getStudentAnnouncements(studentId));
    }
    
    @PostMapping("/{announcementId}/mark-read")
    public ResponseEntity<String> markAsRead(
        @PathVariable Integer announcementId,
        @RequestParam Integer studentId
    ) {
        announcementService.markAsRead(announcementId, studentId);
        return ResponseEntity.ok("Announcement marked as read");
    }
    
    @DeleteMapping("/{announcementId}")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Integer announcementId) {
        announcementService.deleteAnnouncement(announcementId);
        return ResponseEntity.ok("Announcement deleted successfully");
    }
}
