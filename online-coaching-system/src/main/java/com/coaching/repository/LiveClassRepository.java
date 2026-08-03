package com.coaching.repository;

import com.coaching.entities.LiveClass;
import com.coaching.entities.LiveClass.LiveClassStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LiveClassRepository extends JpaRepository<LiveClass, Integer> {
    
    List<LiveClass> findByCourse_CourseId(Integer courseId);
    
    List<LiveClass> findByTeacher_TeacherId(Integer teacherId);
    
    List<LiveClass> findByStatus(LiveClassStatus status);
    
    @Query("SELECT lc FROM LiveClass lc WHERE lc.scheduledDate BETWEEN :start AND :end ORDER BY lc.scheduledDate")
    List<LiveClass> findByScheduledDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT lc FROM LiveClass lc WHERE lc.scheduledDate > :now AND lc.status = 'SCHEDULED' ORDER BY lc.scheduledDate")
    List<LiveClass> findUpcomingClasses(@Param("now") LocalDateTime now);
    
    @Query("SELECT lc FROM LiveClass lc WHERE lc.scheduledDate <= :now AND lc.status = 'SCHEDULED' ORDER BY lc.scheduledDate")
    List<LiveClass> findPastScheduledClasses(@Param("now") LocalDateTime now);
    
    @Query("SELECT lc FROM LiveClass lc WHERE lc.course.courseId = :courseId AND lc.status = 'SCHEDULED' AND lc.scheduledDate > :now ORDER BY lc.scheduledDate")
    List<LiveClass> findUpcomingByCourse(@Param("courseId") Integer courseId, @Param("now") LocalDateTime now);
}
