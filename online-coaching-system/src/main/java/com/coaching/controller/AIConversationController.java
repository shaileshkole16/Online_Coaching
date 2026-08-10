package com.coaching.controller;

import com.coaching.entities.AIConversation;
import com.coaching.service.AIConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-conversations")
@CrossOrigin(origins = "*")
public class AIConversationController {

    @Autowired
    private AIConversationService conversationService;

    @PostMapping
    public ResponseEntity<AIConversation> saveConversation(@RequestBody AIConversation conversation) {
        return ResponseEntity.ok(conversationService.saveConversation(conversation));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AIConversation>> getConversationsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(conversationService.getConversationsByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AIConversation> getConversationById(@PathVariable Long id) {
        AIConversation conversation = conversationService.getConversationById(id);
        if (conversation != null) {
            return ResponseEntity.ok(conversation);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AIConversation> updateConversation(@PathVariable Long id, @RequestBody AIConversation conversation) {
        AIConversation updated = conversationService.updateConversation(id, conversation);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConversation(@PathVariable Long id) {
        conversationService.deleteConversation(id);
        return ResponseEntity.noContent().build();
    }
}