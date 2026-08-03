package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DiscussionForumResponse {
    private Integer id;
    private Integer courseId;
    private String courseName;
    private Integer studentId;
    private String studentName;
    private Integer teacherId;
    private String teacherName;
    private String title;
    private String content;
    private String category;
    private String tags;
    private String status;
    private Boolean isPinned;
    private Boolean isAnswered;
    private Integer views;
    private Integer replyCount;
    private String createdAt;
    private String updatedAt;
}
