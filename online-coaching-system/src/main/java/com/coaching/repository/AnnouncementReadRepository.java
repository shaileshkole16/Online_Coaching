package com.coaching.repository;

import com.coaching.entities.AnnouncementRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementReadRepository extends JpaRepository<AnnouncementRead, Integer> {
    
    Optional<AnnouncementRead> findByAnnouncement_IdAndStudent_StudentId(Integer announcementId, Integer studentId);
    
    List<AnnouncementRead> findByAnnouncement_Id(Integer announcementId);
    
    List<AnnouncementRead> findByStudent_StudentId(Integer studentId);
}
