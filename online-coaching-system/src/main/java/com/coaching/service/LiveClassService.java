package com.coaching.service;

import com.coaching.dto.LiveClassRequest;
import com.coaching.dto.LiveClassResponse;
import com.coaching.entities.LiveClass;
import com.coaching.entities.LiveClass.LiveClassStatus;
import com.coaching.entities.LiveClassParticipant;
import com.coaching.repository.LiveClassRepository;
import com.coaching.repository.LiveClassParticipantRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.TeacherRepository;
import com.coaching.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LiveClassService {
    
    private final LiveClassRepository liveClassRepository;
    private final LiveClassParticipantRepository participantRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    
    public LiveClassResponse createLiveClass(LiveClassRequest request) {
        LiveClass liveClass = new LiveClass();
        liveClass.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow());
        liveClass.setTeacher(teacherRepository.findById(request.getTeacherId()).orElseThrow());
        liveClass.setTitle(request.getTitle());
        liveClass.setDescription(request.getDescription());
        liveClass.setMeetingLink(request.getMeetingLink());
        liveClass.setMeetingId(request.getMeetingId());
        liveClass.setMeetingPassword(request.getMeetingPassword());
        liveClass.setScheduledDate(request.getScheduledDate());
        liveClass.setDuration(request.getDuration());
        liveClass.setMaxParticipants(request.getMaxParticipants());
        liveClass.setThumbnailUrl(request.getThumbnailUrl());
        liveClass.setStatus(LiveClassStatus.SCHEDULED);
        
        liveClass = liveClassRepository.save(liveClass);
        return convertToResponse(liveClass);
    }
    
    public LiveClassResponse updateLiveClass(Integer liveClassId, LiveClassRequest request) {
        LiveClass liveClass = liveClassRepository.findById(liveClassId).orElseThrow();
        liveClass.setTitle(request.getTitle());
        liveClass.setDescription(request.getDescription());
        liveClass.setMeetingLink(request.getMeetingLink());
        liveClass.setMeetingId(request.getMeetingId());
        liveClass.setMeetingPassword(request.getMeetingPassword());
        liveClass.setScheduledDate(request.getScheduledDate());
        liveClass.setDuration(request.getDuration());
        liveClass.setMaxParticipants(request.getMaxParticipants());
        liveClass.setThumbnailUrl(request.getThumbnailUrl());
        
        liveClass = liveClassRepository.save(liveClass);
        return convertToResponse(liveClass);
    }
    
    public LiveClassResponse getLiveClass(Integer liveClassId) {
        LiveClass liveClass = liveClassRepository.findById(liveClassId).orElseThrow();
        return convertToResponse(liveClass);
    }
    
    public List<LiveClassResponse> getCourseLiveClasses(Integer courseId) {
        List<LiveClass> liveClasses = liveClassRepository.findByCourse_CourseId(courseId);
        return liveClasses.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<LiveClassResponse> getTeacherLiveClasses(Integer teacherId) {
        List<LiveClass> liveClasses = liveClassRepository.findByTeacher_TeacherId(teacherId);
        return liveClasses.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<LiveClassResponse> getUpcomingClasses() {
        List<LiveClass> liveClasses = liveClassRepository.findUpcomingClasses(LocalDateTime.now());
        return liveClasses.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<LiveClassResponse> getUpcomingByCourse(Integer courseId) {
        List<LiveClass> liveClasses = liveClassRepository.findUpcomingByCourse(courseId, LocalDateTime.now());
        return liveClasses.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public LiveClassResponse startLiveClass(Integer liveClassId) {
        LiveClass liveClass = liveClassRepository.findById(liveClassId).orElseThrow();
        liveClass.setStatus(LiveClassStatus.LIVE);
        liveClass = liveClassRepository.save(liveClass);
        return convertToResponse(liveClass);
    }
    
    public LiveClassResponse endLiveClass(Integer liveClassId, String recordingUrl) {
        LiveClass liveClass = liveClassRepository.findById(liveClassId).orElseThrow();
        liveClass.setStatus(LiveClassStatus.COMPLETED);
        liveClass.setRecordingUrl(recordingUrl);
        liveClass = liveClassRepository.save(liveClass);
        return convertToResponse(liveClass);
    }
    
    public LiveClassResponse cancelLiveClass(Integer liveClassId) {
        LiveClass liveClass = liveClassRepository.findById(liveClassId).orElseThrow();
        liveClass.setStatus(LiveClassStatus.CANCELLED);
        liveClass = liveClassRepository.save(liveClass);
        return convertToResponse(liveClass);
    }
    
    public void joinLiveClass(Integer liveClassId, Integer studentId) {
        LiveClass liveClass = liveClassRepository.findById(liveClassId).orElseThrow();
        
        LiveClassParticipant participant = new LiveClassParticipant();
        participant.setLiveClass(liveClass);
        participant.setStudent(studentRepository.findById(studentId).orElseThrow());
        participant.setJoinTime(LocalDateTime.now());
        participantRepository.save(participant);
    }
    
    public void leaveLiveClass(Integer liveClassId, Integer studentId) {
        LiveClassParticipant participant = participantRepository
            .findByLiveClass_IdAndStudent_StudentId(liveClassId, studentId)
            .orElseThrow();
        participant.setLeaveTime(LocalDateTime.now());
        if (participant.getJoinTime() != null) {
            long minutes = java.time.Duration.between(participant.getJoinTime(), participant.getLeaveTime()).toMinutes();
            participant.setDurationAttended((int) minutes);
        }
        participantRepository.save(participant);
    }
    
    public void deleteLiveClass(Integer liveClassId) {
        liveClassRepository.deleteById(liveClassId);
    }
    
    private LiveClassResponse convertToResponse(LiveClass liveClass) {
        LiveClassResponse response = new LiveClassResponse();
        response.setId(liveClass.getId());
        response.setCourseId(liveClass.getCourse().getCourseId());
        response.setCourseName(liveClass.getCourse().getTitle());
        response.setTeacherId(liveClass.getTeacher().getTeacherId());
        response.setTeacherName(liveClass.getTeacher().getUser().getName());
        response.setTitle(liveClass.getTitle());
        response.setDescription(liveClass.getDescription());
        response.setMeetingLink(liveClass.getMeetingLink());
        response.setMeetingId(liveClass.getMeetingId());
        response.setMeetingPassword(liveClass.getMeetingPassword());
        response.setScheduledDate(liveClass.getScheduledDate());
        response.setDuration(liveClass.getDuration());
        response.setStatus(liveClass.getStatus().name());
        response.setRecordingUrl(liveClass.getRecordingUrl());
        response.setMaxParticipants(liveClass.getMaxParticipants());
        response.setThumbnailUrl(liveClass.getThumbnailUrl());
        response.setCreatedBy(liveClass.getCreatedBy() != null ? liveClass.getCreatedBy().getName() : null);
        response.setCreatedAt(liveClass.getCreatedAt().toString());
        response.setUpdatedAt(liveClass.getUpdatedAt().toString());
        
        List<LiveClassParticipant> participants = participantRepository.findByLiveClass_Id(liveClass.getId());
        response.setParticipantCount(participants.size());
        
        return response;
    }
}
