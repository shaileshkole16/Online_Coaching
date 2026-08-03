package com.coaching.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Integer id;
    private Integer senderId;
    private String senderName;
    private Integer receiverId;
    private String content;
    private LocalDateTime timestamp;
}
