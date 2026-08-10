package com.coaching.service;

import com.coaching.dto.DiscussionForumRequest;
import com.coaching.dto.DiscussionForumResponse;
import com.coaching.dto.DiscussionReplyRequest;
import com.coaching.dto.DiscussionReplyResponse;
import com.coaching.entities.DiscussionForum;
import com.coaching.entities.DiscussionForum.ForumStatus;
import com.coaching.entities.DiscussionReply;
import com.coaching.repository.DiscussionForumRepository;
import com.coaching.repository.DiscussionReplyRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscussionForumService {
    
    private final DiscussionForumRepository forumRepository;
    private final DiscussionReplyRepository replyRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    
    public DiscussionForumResponse createForum(DiscussionForumRequest request) {
        DiscussionForum forum = new DiscussionForum();
        forum.setCourse(courseRepository.findById(request.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found with ID: " + request.getCourseId())));
        
        if (request.getStudentId() != null) {
            try {
                forum.setStudent(studentRepository.findById(request.getStudentId()).orElse(null));
            } catch (Exception e) {
                System.err.println("Warning: Could not find student with ID: " + request.getStudentId());
            }
        }
        if (request.getTeacherId() != null) {
            try {
                forum.setTeacher(teacherRepository.findById(request.getTeacherId()).orElse(null));
            } catch (Exception e) {
                System.err.println("Warning: Could not find teacher with ID: " + request.getTeacherId());
            }
        }
        forum.setTitle(request.getTitle());
        forum.setContent(request.getContent());
        forum.setCategory(request.getCategory());
        forum.setTags(request.getTags());
        forum.setStatus(ForumStatus.valueOf(request.getStatus()));
        forum.setIsPinned(request.getIsPinned() != null ? request.getIsPinned() : false);
        
        forum = forumRepository.save(forum);
        return convertToResponse(forum);
    }
    
    public DiscussionForumResponse updateForum(Integer forumId, DiscussionForumRequest request) {
        DiscussionForum forum = forumRepository.findById(forumId).orElseThrow();
        forum.setTitle(request.getTitle());
        forum.setContent(request.getContent());
        forum.setCategory(request.getCategory());
        forum.setTags(request.getTags());
        forum.setStatus(ForumStatus.valueOf(request.getStatus()));
        forum.setIsPinned(request.getIsPinned());
        
        forum = forumRepository.save(forum);
        return convertToResponse(forum);
    }
    
    public DiscussionForumResponse getForum(Integer forumId) {
        DiscussionForum forum = forumRepository.findById(forumId).orElseThrow();
        forum.setViews(forum.getViews() + 1);
        forumRepository.save(forum);
        return convertToResponse(forum);
    }
    
    public List<DiscussionForumResponse> getCourseForums(Integer courseId) {
        List<DiscussionForum> forums = forumRepository.findOpenByCourse(courseId);
        return forums.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<DiscussionForumResponse> getStudentForums(Integer studentId) {
        List<DiscussionForum> forums = forumRepository.findByStudent_StudentId(studentId);
        return forums.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<DiscussionForumResponse> getTeacherForums(Integer teacherId) {
        List<DiscussionForum> forums = forumRepository.findByTeacher_TeacherId(teacherId);
        return forums.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public DiscussionReplyResponse createReply(DiscussionReplyRequest request) {
        DiscussionReply reply = new DiscussionReply();
        reply.setForum(forumRepository.findById(request.getForumId()).orElseThrow());
        if (request.getStudentId() != null) {
            reply.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
        }
        if (request.getTeacherId() != null) {
            reply.setTeacher(teacherRepository.findById(request.getTeacherId()).orElseThrow());
        }
        reply.setContent(request.getContent());
        if (request.getParentReplyId() != null) {
            reply.setParentReply(replyRepository.findById(request.getParentReplyId()).orElse(null));
        }
        
        reply = replyRepository.save(reply);
        
        // Update forum answered status if teacher replied
        if (reply.getTeacher() != null) {
            DiscussionForum forum = reply.getForum();
            forum.setIsAnswered(true);
            forumRepository.save(forum);
        }
        
        return convertToReplyResponse(reply);
    }
    
    public DiscussionReplyResponse acceptAnswer(Integer replyId) {
        DiscussionReply reply = replyRepository.findById(replyId).orElseThrow();
        reply.setIsAcceptedAnswer(true);
        replyRepository.save(reply);
        
        DiscussionForum forum = reply.getForum();
        forum.setIsAnswered(true);
        forumRepository.save(forum);
        
        return convertToReplyResponse(reply);
    }
    
    public List<DiscussionReplyResponse> getForumReplies(Integer forumId) {
        List<DiscussionReply> replies = replyRepository.findByForum_Id(forumId);
        return replies.stream().map(this::convertToReplyResponse).collect(Collectors.toList());
    }
    
    public void deleteForum(Integer forumId) {
        forumRepository.deleteById(forumId);
    }
    
    public void deleteReply(Integer replyId) {
        replyRepository.deleteById(replyId);
    }
    
    private DiscussionForumResponse convertToResponse(DiscussionForum forum) {
        DiscussionForumResponse response = new DiscussionForumResponse();
        response.setId(forum.getId());
        response.setCourseId(forum.getCourse().getCourseId());
        response.setCourseName(forum.getCourse().getTitle());
        if (forum.getStudent() != null) {
            response.setStudentId(forum.getStudent().getStudentId());
            response.setStudentName(forum.getStudent().getUser().getName());
        }
        if (forum.getTeacher() != null) {
            response.setTeacherId(forum.getTeacher().getTeacherId());
            response.setTeacherName(forum.getTeacher().getUser().getName());
        }
        response.setTitle(forum.getTitle());
        response.setContent(forum.getContent());
        response.setCategory(forum.getCategory());
        response.setTags(forum.getTags());
        response.setStatus(forum.getStatus().name());
        response.setIsPinned(forum.getIsPinned());
        response.setIsAnswered(forum.getIsAnswered());
        response.setViews(forum.getViews());
        response.setCreatedAt(forum.getCreatedAt().toString());
        response.setUpdatedAt(forum.getUpdatedAt().toString());
        
        List<DiscussionReply> replies = replyRepository.findByForum_Id(forum.getId());
        response.setReplyCount(replies.size());
        
        return response;
    }
    
    private DiscussionReplyResponse convertToReplyResponse(DiscussionReply reply) {
        DiscussionReplyResponse response = new DiscussionReplyResponse();
        response.setId(reply.getId());
        response.setForumId(reply.getForum().getId());
        if (reply.getStudent() != null) {
            response.setStudentId(reply.getStudent().getStudentId());
            response.setStudentName(reply.getStudent().getUser().getName());
        }
        if (reply.getTeacher() != null) {
            response.setTeacherId(reply.getTeacher().getTeacherId());
            response.setTeacherName(reply.getTeacher().getUser().getName());
        }
        response.setContent(reply.getContent());
        response.setIsAcceptedAnswer(reply.getIsAcceptedAnswer());
        if (reply.getParentReply() != null) {
            response.setParentReplyId(reply.getParentReply().getId());
        }
        response.setCreatedAt(reply.getCreatedAt().toString());
        response.setUpdatedAt(reply.getUpdatedAt().toString());
        return response;
    }
}
