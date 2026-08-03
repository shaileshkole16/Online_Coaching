package com.coaching.service;

import com.coaching.dto.AnnouncementRequest;
import com.coaching.dto.AnnouncementResponse;
import com.coaching.entities.Announcement;
import com.coaching.entities.Announcement.AnnouncementStatus;
import com.coaching.entities.Announcement.AnnouncementType;
import com.coaching.entities.Announcement.Priority;
import com.coaching.entities.AnnouncementRead;
import com.coaching.repository.AnnouncementRepository;
import com.coaching.repository.AnnouncementReadRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.TeacherRepository;
import com.coaching.repository.AdminRepository;
import com.coaching.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementService {
    
    private final AnnouncementRepository announcementRepository;
    private final AnnouncementReadRepository announcementReadRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    
    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
        Announcement announcement = new Announcement();
        if (request.getCourseId() != null) {
            announcement.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow());
        }
        if (request.getTeacherId() != null) {
            announcement.setTeacher(teacherRepository.findById(request.getTeacherId()).orElseThrow());
        }
        if (request.getAdminId() != null) {
            announcement.setAdmin(adminRepository.findById(request.getAdminId()).orElseThrow());
        }
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setAnnouncementType(AnnouncementType.valueOf(request.getAnnouncementType()));
        announcement.setPriority(Priority.valueOf(request.getPriority()));
        announcement.setAttachmentUrl(request.getAttachmentUrl());
        announcement.setStatus(AnnouncementStatus.valueOf(request.getStatus()));
        announcement.setPublishDate(request.getPublishDate());
        announcement.setExpiryDate(request.getExpiryDate());
        
        announcement = announcementRepository.save(announcement);
        return convertToResponse(announcement);
    }
    
    public AnnouncementResponse updateAnnouncement(Integer announcementId, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(announcementId).orElseThrow();
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setAnnouncementType(AnnouncementType.valueOf(request.getAnnouncementType()));
        announcement.setPriority(Priority.valueOf(request.getPriority()));
        announcement.setAttachmentUrl(request.getAttachmentUrl());
        announcement.setStatus(AnnouncementStatus.valueOf(request.getStatus()));
        announcement.setExpiryDate(request.getExpiryDate());
        
        announcement = announcementRepository.save(announcement);
        return convertToResponse(announcement);
    }
    
    public AnnouncementResponse getAnnouncement(Integer announcementId) {
        Announcement announcement = announcementRepository.findById(announcementId).orElseThrow();
        return convertToResponse(announcement);
    }
    
    public List<AnnouncementResponse> getCourseAnnouncements(Integer courseId) {
        List<Announcement> announcements = announcementRepository.findActiveByCourse(courseId, LocalDateTime.now());
        return announcements.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AnnouncementResponse> getTeacherAnnouncements(Integer teacherId) {
        List<Announcement> announcements = announcementRepository.findByTeacher_TeacherId(teacherId);
        return announcements.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AnnouncementResponse> getAdminAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAdminAnnouncements(LocalDateTime.now());
        return announcements.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AnnouncementResponse> getStudentAnnouncements(Integer studentId) {
        List<Announcement> announcements = announcementRepository.findActiveAnnouncements(LocalDateTime.now());
        return announcements.stream()
            .map(a -> convertToResponse(a, studentId))
            .collect(Collectors.toList());
    }
    
    public void markAsRead(Integer announcementId, Integer studentId) {
        Announcement announcement = announcementRepository.findById(announcementId).orElseThrow();
        
        if (!announcementReadRepository.findByAnnouncement_IdAndStudent_StudentId(announcementId, studentId).isPresent()) {
            AnnouncementRead announcementRead = new AnnouncementRead();
            announcementRead.setAnnouncement(announcement);
            announcementRead.setStudent(studentRepository.findById(studentId).orElseThrow());
            announcementReadRepository.save(announcementRead);
        }
    }
    
    public void deleteAnnouncement(Integer announcementId) {
        announcementRepository.deleteById(announcementId);
    }
    
    private AnnouncementResponse convertToResponse(Announcement announcement) {
        return convertToResponse(announcement, null);
    }
    
    private AnnouncementResponse convertToResponse(Announcement announcement, Integer studentId) {
        AnnouncementResponse response = new AnnouncementResponse();
        response.setId(announcement.getId());
        if (announcement.getCourse() != null) {
            response.setCourseId(announcement.getCourse().getCourseId());
            response.setCourseName(announcement.getCourse().getTitle());
        }
        if (announcement.getTeacher() != null) {
            response.setTeacherId(announcement.getTeacher().getTeacherId());
            response.setTeacherName(announcement.getTeacher().getUser().getName());
        }
        if (announcement.getAdmin() != null) {
            response.setAdminId(announcement.getAdmin().getAdminId());
            response.setAdminName(announcement.getAdmin().getUser().getName());
        }
        response.setTitle(announcement.getTitle());
        response.setContent(announcement.getContent());
        response.setAnnouncementType(announcement.getAnnouncementType().name());
        response.setPriority(announcement.getPriority().name());
        response.setAttachmentUrl(announcement.getAttachmentUrl());
        response.setStatus(announcement.getStatus().name());
        response.setPublishDate(announcement.getPublishDate());
        response.setExpiryDate(announcement.getExpiryDate());
        response.setCreatedAt(announcement.getCreatedAt().toString());
        response.setUpdatedAt(announcement.getUpdatedAt().toString());
        
        List<AnnouncementRead> reads = announcementReadRepository.findByAnnouncement_Id(announcement.getId());
        response.setReadCount(reads.size());
        
        if (studentId != null) {
            response.setIsRead(reads.stream().anyMatch(r -> r.getStudent().getStudentId().equals(studentId)));
        }
        
        return response;
    }
}
