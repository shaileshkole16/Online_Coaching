package com.coaching.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    private Integer senderId;    // ✅ User ID from User table
    private Integer receiverId;  // ✅ User ID from User table
    private String message;
}