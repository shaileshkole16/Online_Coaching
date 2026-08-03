package com.coaching.repository;

import com.coaching.entities.CalendarEvent;
import com.coaching.entities.CalendarEvent.EventType;
import com.coaching.entities.CalendarEvent.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Integer> {
    
    List<CalendarEvent> findByUser_UserId(Integer userId);
    
    List<CalendarEvent> findByEventType(EventType eventType);
    
    List<CalendarEvent> findByStatus(EventStatus status);
    
    @Query("SELECT ce FROM CalendarEvent ce WHERE ce.user.userId = :userId AND ce.startDateTime BETWEEN :start AND :end ORDER BY ce.startDateTime")
    List<CalendarEvent> findByUserAndDateRange(@Param("userId") Integer userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT ce FROM CalendarEvent ce WHERE ce.user.userId = :userId AND ce.startDateTime >= :now AND ce.status = 'SCHEDULED' ORDER BY ce.startDateTime")
    List<CalendarEvent> findUpcomingByUser(@Param("userId") Integer userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT ce FROM CalendarEvent ce WHERE ce.course.courseId = :courseId")
    List<CalendarEvent> findByCourse(@Param("courseId") Integer courseId);
}
