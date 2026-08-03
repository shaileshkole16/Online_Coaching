package com.coaching.repository;

import com.coaching.entities.DiscussionReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscussionReplyRepository extends JpaRepository<DiscussionReply, Integer> {
    
    List<DiscussionReply> findByForum_Id(Integer forumId);
    
    List<DiscussionReply> findByStudent_StudentId(Integer studentId);
    
    List<DiscussionReply> findByTeacher_TeacherId(Integer teacherId);
    
    List<DiscussionReply> findByParentReply_Id(Integer parentReplyId);
    
    List<DiscussionReply> findByForum_IdAndIsAcceptedAnswerTrue(Integer forumId);
}
