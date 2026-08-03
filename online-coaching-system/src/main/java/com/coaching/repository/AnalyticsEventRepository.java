package com.coaching.repository;

import com.coaching.entities.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, Long> {
    
    List<AnalyticsEvent> findBySessionId(String sessionId);
    
    List<AnalyticsEvent> findByUserId(Long userId);
    
    List<AnalyticsEvent> findByEventName(String eventName);
    
    List<AnalyticsEvent> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(a) FROM AnalyticsEvent a WHERE a.eventName = :eventName")
    Long countByEventName(@Param("eventName") String eventName);
    
    @Query("SELECT a.eventName, COUNT(a) FROM AnalyticsEvent a GROUP BY a.eventName")
    List<Object[]> countEventsByType();
    
    @Query("SELECT COUNT(a) FROM AnalyticsEvent a WHERE a.createdAt BETWEEN :start AND :end")
    Long countEventsInDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT a FROM AnalyticsEvent a WHERE a.userId = :userId ORDER BY a.createdAt DESC")
    List<AnalyticsEvent> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}
