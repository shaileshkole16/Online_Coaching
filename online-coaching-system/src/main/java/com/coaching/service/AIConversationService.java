package com.coaching.service;

import com.coaching.entities.AIConversation;
import com.coaching.repository.AIConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AIConversationService {

    @Autowired
    private AIConversationRepository conversationRepository;

    public AIConversation saveConversation(AIConversation conversation) {
        if (conversation.getCreatedAt() == null) {
            conversation.setCreatedAt(LocalDateTime.now());
        }
        conversation.setUpdatedAt(LocalDateTime.now());
        return conversationRepository.save(conversation);
    }

    public List<AIConversation> getConversationsByUserId(Long userId) {
        return conversationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public AIConversation getConversationById(Long id) {
        return conversationRepository.findById(id).orElse(null);
    }

    public AIConversation updateConversation(Long id, AIConversation conversation) {
        AIConversation existing = conversationRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(conversation.getTitle());
            existing.setMessages(conversation.getMessages());
            existing.setUpdatedAt(LocalDateTime.now());
            return conversationRepository.save(existing);
        }
        return null;
    }

    public void deleteConversation(Long id) {
        conversationRepository.deleteById(id);
    }
}