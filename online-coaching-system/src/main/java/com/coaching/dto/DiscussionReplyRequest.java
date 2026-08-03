package com.coaching.dto;

import lombok.Data;

@Data
public class DiscussionReplyRequest {
    private Integer forumId;
    private Integer studentId;
    private Integer teacherId;
    private String content;
    private Integer parentReplyId;
}
