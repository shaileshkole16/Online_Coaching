package com.coaching.service;

import com.coaching.dto.CalendarEventRequest;
import com.coaching.dto.CalendarEventResponse;
import com.coaching.entities.CalendarEvent;
import com.coaching.entities.CalendarEvent.EventType;
import com.coaching.entities.CalendarEvent.EventStatus;
import com.coaching.repository.CalendarEventRepository;
import com.coaching.repository.UserRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.AssignmentRepository;
import com.coaching.repository.QuizRepository;
import com.coaching.repository.LiveClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarEventService {
    
    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuizRepository quizRepository;
    private final LiveClassRepository liveClassRepository;
    
    public CalendarEventResponse createEvent(CalendarEventRequest request) {
        CalendarEvent event = new CalendarEvent();
        event.setUser(userRepository.findById(request.getUserId()).orElseThrow());
        event.setEventType(EventType.valueOf(request.getEventType()));
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDateTime(request.getStartDateTime());
        event.setEndDateTime(request.getEndDateTime());
        event.setLocation(request.getLocation());
        if (request.getCourseId() != null) {
            event.setCourse(courseRepository.findById(request.getCourseId()).orElse(null));
        }
        if (request.getAssignmentId() != null) {
            event.setAssignment(assignmentRepository.findById(request.getAssignmentId()).orElse(null));
        }
        if (request.getQuizId() != null) {
            event.setQuiz(quizRepository.findById(request.getQuizId()).orElse(null));
        }
        if (request.getLiveClassId() != null) {
            event.setLiveClass(liveClassRepository.findById(request.getLiveClassId()).orElse(null));
        }
        event.setIsAllDay(request.getIsAllDay());
        event.setReminderMinutes(request.getReminderMinutes());
        event.setStatus(EventStatus.valueOf(request.getStatus()));
        
        event = calendarEventRepository.save(event);
        return convertToResponse(event);
    }
    
    public CalendarEventResponse updateEvent(Integer eventId, CalendarEventRequest request) {
        CalendarEvent event = calendarEventRepository.findById(eventId).orElseThrow();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDateTime(request.getStartDateTime());
        event.setEndDateTime(request.getEndDateTime());
        event.setLocation(request.getLocation());
        event.setIsAllDay(request.getIsAllDay());
        event.setReminderMinutes(request.getReminderMinutes());
        event.setStatus(EventStatus.valueOf(request.getStatus()));
        
        event = calendarEventRepository.save(event);
        return convertToResponse(event);
    }
    
    public CalendarEventResponse getEvent(Integer eventId) {
        CalendarEvent event = calendarEventRepository.findById(eventId).orElseThrow();
        return convertToResponse(event);
    }
    
    public List<CalendarEventResponse> getUserEvents(Integer userId) {
        List<CalendarEvent> events = calendarEventRepository.findByUser_UserId(userId);
        return events.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<CalendarEventResponse> getUserEventsByDateRange(Integer userId, LocalDateTime start, LocalDateTime end) {
        List<CalendarEvent> events = calendarEventRepository.findByUserAndDateRange(userId, start, end);
        return events.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<CalendarEventResponse> getUpcomingEvents(Integer userId) {
        List<CalendarEvent> events = calendarEventRepository.findUpcomingByUser(userId, LocalDateTime.now());
        return events.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<CalendarEventResponse> getCourseEvents(Integer courseId) {
        List<CalendarEvent> events = calendarEventRepository.findByCourse(courseId);
        return events.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public void deleteEvent(Integer eventId) {
        calendarEventRepository.deleteById(eventId);
    }
    
    private CalendarEventResponse convertToResponse(CalendarEvent event) {
        CalendarEventResponse response = new CalendarEventResponse();
        response.setId(event.getId());
        response.setUserId(event.getUser().getUserId());
        response.setUserName(event.getUser().getName());
        response.setEventType(event.getEventType().name());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setStartDateTime(event.getStartDateTime());
        response.setEndDateTime(event.getEndDateTime());
        response.setLocation(event.getLocation());
        if (event.getCourse() != null) {
            response.setCourseId(event.getCourse().getCourseId());
            response.setCourseName(event.getCourse().getTitle());
        }
        if (event.getAssignment() != null) {
            response.setAssignmentId(event.getAssignment().getAssignmentId());
            response.setAssignmentTitle(event.getAssignment().getTitle());
        }
        if (event.getQuiz() != null) {
            response.setQuizId(event.getQuiz().getQuizId());
            response.setQuizTitle(event.getQuiz().getTitle());
        }
        if (event.getLiveClass() != null) {
            response.setLiveClassId(event.getLiveClass().getId());
            response.setLiveClassTitle(event.getLiveClass().getTitle());
        }
        response.setIsAllDay(event.getIsAllDay());
        response.setReminderMinutes(event.getReminderMinutes());
        response.setStatus(event.getStatus().name());
        response.setCreatedAt(event.getCreatedAt().toString());
        response.setUpdatedAt(event.getUpdatedAt().toString());
        return response;
    }
}
