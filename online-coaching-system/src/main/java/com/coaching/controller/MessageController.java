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
    public ResponseEntity<String> sendMessage(@RequestBody MessageRequest req) {
        return ResponseEntity.ok(messageService.sendMessage(req));
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