package com.coaching.repository;

import com.coaching.entities.LiveClassParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LiveClassParticipantRepository extends JpaRepository<LiveClassParticipant, Integer> {
    
    Optional<LiveClassParticipant> findByLiveClass_IdAndStudent_StudentId(Integer liveClassId, Integer studentId);
    
    List<LiveClassParticipant> findByLiveClass_Id(Integer liveClassId);
    
    List<LiveClassParticipant> findByStudent_StudentId(Integer studentId);
}
