package com.coaching.service;

import com.coaching.dto.MessageRequest;
import com.coaching.dto.MessageResponse;
import com.coaching.entities.Message;
import com.coaching.entities.User;
import com.coaching.repository.MessageRepository;
import com.coaching.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired private MessageRepository messageRepo;
    @Autowired private UserRepository userRepo;

    public String sendMessage(MessageRequest req) {
        try {
            System.out.println("Sending message - Sender ID: " + req.getSenderId() + ", Receiver ID: " + req.getReceiverId());
            
            if (req.getSenderId() == null || req.getReceiverId() == null) {
                return "Sender ID and Receiver ID are required!";
            }
            
            Optional<User> sender   = userRepo.findById(req.getSenderId());
            Optional<User> receiver = userRepo.findById(req.getReceiverId());

            System.out.println("Sender found: " + sender.isPresent());
            System.out.println("Receiver found: " + receiver.isPresent());

            if (sender.isEmpty())   return "Sender not found with ID: " + req.getSenderId();
            if (receiver.isEmpty()) return "Receiver not found with ID: " + req.getReceiverId();

            Message message = new Message();
            message.setSender(sender.get());
            message.setReceiver(receiver.get());
            message.setMessage(req.getMessage());
            message.setSentAt(LocalDateTime.now());
            messageRepo.save(message);
            return "Message sent successfully!";
        } catch (Exception e) {
            System.out.println("Error sending message: " + e.getMessage());
            e.printStackTrace();
            return "Error sending message: " + e.getMessage();
        }
    }

    public List<MessageResponse> getInbox(Integer receiverId) {
        return messageRepo.findByReceiver_UserId(receiverId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<MessageResponse> getConversation(Integer senderId, Integer receiverId) {
        return messageRepo.findConversation(senderId, receiverId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse convertToResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getMessageId());
        response.setSenderId(message.getSender() != null ? message.getSender().getUserId() : null);
        response.setSenderName(message.getSender() != null ? message.getSender().getName() : "Unknown");
        response.setReceiverId(message.getReceiver() != null ? message.getReceiver().getUserId() : null);
        response.setContent(message.getMessage());
        response.setTimestamp(message.getSentAt());
        return response;
    }

    public String deleteMessage(Integer messageId) {
        if (!messageRepo.existsById(messageId)) return "Message not found!";
        messageRepo.deleteById(messageId);
        return "Message deleted successfully!";
    }
}