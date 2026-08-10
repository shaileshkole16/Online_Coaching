package com.coaching.repository;

import com.coaching.entities.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Integer> {
    List<Submission> findByStudent_StudentId(Integer studentId);
    List<Submission> findByAssignment_AssignmentId(Integer assignmentId);
    boolean existsByAssignment_AssignmentIdAndStudent_StudentId(Integer assignmentId, Integer studentId);
    void deleteByAssignment_AssignmentId(Integer assignmentId);
    void deleteByStudent_StudentId(Integer studentId);
}
