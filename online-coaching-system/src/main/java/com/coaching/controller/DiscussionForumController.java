package com.coaching.controller;

import com.coaching.dto.DiscussionForumRequest;
import com.coaching.dto.DiscussionForumResponse;
import com.coaching.dto.DiscussionReplyRequest;
import com.coaching.dto.DiscussionReplyResponse;
import com.coaching.service.DiscussionForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/discussion-forum")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DiscussionForumController {
    
    private final DiscussionForumService forumService;
    
    @PostMapping("/create")
    public ResponseEntity<DiscussionForumResponse> createForum(@RequestBody DiscussionForumRequest request) {
        return ResponseEntity.ok(forumService.createForum(request));
    }
    
    @PutMapping("/{forumId}")
    public ResponseEntity<DiscussionForumResponse> updateForum(
        @PathVariable Integer forumId,
        @RequestBody DiscussionForumRequest request
    ) {
        return ResponseEntity.ok(forumService.updateForum(forumId, request));
    }
    
    @GetMapping("/{forumId}")
    public ResponseEntity<DiscussionForumResponse> getForum(@PathVariable Integer forumId) {
        return ResponseEntity.ok(forumService.getForum(forumId));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<DiscussionForumResponse>> getCourseForums(@PathVariable Integer courseId) {
        return ResponseEntity.ok(forumService.getCourseForums(courseId));
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<DiscussionForumResponse>> getStudentForums(@PathVariable Integer studentId) {
        return ResponseEntity.ok(forumService.getStudentForums(studentId));
    }
    
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<DiscussionForumResponse>> getTeacherForums(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(forumService.getTeacherForums(teacherId));
    }
    
    @PostMapping("/reply")
    public ResponseEntity<DiscussionReplyResponse> createReply(@RequestBody DiscussionReplyRequest request) {
        return ResponseEntity.ok(forumService.createReply(request));
    }
    
    @PostMapping("/reply/{replyId}/accept")
    public ResponseEntity<DiscussionReplyResponse> acceptAnswer(@PathVariable Integer replyId) {
        return ResponseEntity.ok(forumService.acceptAnswer(replyId));
    }
    
    @GetMapping("/{forumId}/replies")
    public ResponseEntity<List<DiscussionReplyResponse>> getForumReplies(@PathVariable Integer forumId) {
        return ResponseEntity.ok(forumService.getForumReplies(forumId));
    }
    
    @DeleteMapping("/{forumId}")
    public ResponseEntity<String> deleteForum(@PathVariable Integer forumId) {
        forumService.deleteForum(forumId);
        return ResponseEntity.ok("Forum deleted successfully");
    }
    
    @DeleteMapping("/reply/{replyId}")
    public ResponseEntity<String> deleteReply(@PathVariable Integer replyId) {
        forumService.deleteReply(replyId);
        return ResponseEntity.ok("Reply deleted successfully");
    }
}
