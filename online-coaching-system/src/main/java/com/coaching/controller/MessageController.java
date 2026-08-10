package com.coaching.controller;

import com.coaching.dto.MessageRequest;
import com.coaching.dto.MessageResponse;
import com.coaching.entities.Message;
import com.coaching.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest req) {
        try {
            String result = messageService.sendMessage(req);
            if (result.startsWith("Error") || result.contains("not found")) {
                return ResponseEntity.status(400).body(result);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("Error in sendMessage controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/inbox/{receiverId}")
    public ResponseEntity<List<MessageResponse>> getInbox(@PathVariable Integer receiverId) {
        return ResponseEntity.ok(messageService.getInbox(receiverId));
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @RequestParam Integer senderId,
            @RequestParam Integer receiverId) {
        return ResponseEntity.ok(messageService.getConversation(senderId, receiverId));
    }

    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<String> deleteMessage(@PathVariable Integer messageId) {
        return ResponseEntity.ok(messageService.deleteMessage(messageId));
    }
}