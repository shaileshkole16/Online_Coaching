package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DiscussionReplyResponse {
    private Integer id;
    private Integer forumId;
    private Integer studentId;
    private String studentName;
    private Integer teacherId;
    private String teacherName;
    private String content;
    private Boolean isAcceptedAnswer;
    private Integer parentReplyId;
    private String createdAt;
    private String updatedAt;
}
