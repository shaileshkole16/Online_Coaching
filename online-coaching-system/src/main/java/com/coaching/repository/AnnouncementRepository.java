package com.coaching.repository;

import com.coaching.entities.Announcement;
import com.coaching.entities.Announcement.AnnouncementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {
    
    List<Announcement> findByCourse_CourseId(Integer courseId);
    
    List<Announcement> findByTeacher_TeacherId(Integer teacherId);
    
    List<Announcement> findByStatus(AnnouncementStatus status);
    
    @Query("SELECT a FROM Announcement a WHERE a.publishDate <= :now AND (a.expiryDate IS NULL OR a.expiryDate > :now) AND a.status = 'PUBLISHED' ORDER BY a.publishDate DESC")
    List<Announcement> findActiveAnnouncements(@Param("now") LocalDateTime now);
    
    @Query("SELECT a FROM Announcement a WHERE a.course.courseId = :courseId AND a.publishDate <= :now AND (a.expiryDate IS NULL OR a.expiryDate > :now) AND a.status = 'PUBLISHED' ORDER BY a.publishDate DESC")
    List<Announcement> findActiveByCourse(@Param("courseId") Integer courseId, @Param("now") LocalDateTime now);
    
    @Query("SELECT a FROM Announcement a WHERE a.admin.adminId IS NOT NULL AND a.publishDate <= :now AND (a.expiryDate IS NULL OR a.expiryDate > :now) AND a.status = 'PUBLISHED' ORDER BY a.publishDate DESC")
    List<Announcement> findAdminAnnouncements(@Param("now") LocalDateTime now);
}
