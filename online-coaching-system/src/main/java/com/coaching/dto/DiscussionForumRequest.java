package com.coaching.dto;

import lombok.Data;

@Data
public class DiscussionForumRequest {
    private Integer courseId;
    private Integer studentId;
    private Integer teacherId;
    private String title;
    private String content;
    private String category;
    private String tags;
    private String status; // OPEN, CLOSED, ARCHIVED
    private Boolean isPinned;
}
