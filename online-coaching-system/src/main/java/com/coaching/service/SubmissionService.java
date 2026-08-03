package com.coaching.service;

import com.coaching.entities.Submission;
import com.coaching.entities.Assignment;
import com.coaching.entities.Student;
import com.coaching.repository.SubmissionRepository;
import com.coaching.repository.AssignmentRepository;
import com.coaching.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    @Autowired private SubmissionRepository submissionRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private ResultService resultService;

    public String submitAssignment(Integer assignmentId, Integer studentId, String fileUrl) {
        Optional<Assignment> assignment = assignmentRepo.findById(assignmentId);
        Optional<Student> student = studentRepo.findById(studentId);
        
        if (assignment.isEmpty()) return "Assignment not found!";
        if (student.isEmpty()) return "Student not found!";
        if (submissionRepo.existsByAssignment_AssignmentIdAndStudent_StudentId(assignmentId, studentId))
            return "Assignment already submitted by this student!";

        Submission submission = new Submission();
        submission.setAssignment(assignment.get());
        submission.setStudent(student.get());
        submission.setSubmissionDate(LocalDate.now());
        submission.setFileUrl(fileUrl);
        
        submissionRepo.save(submission);
        return "Assignment submitted successfully! Submission ID: " + submission.getSubmissionId();
    }

    public List<Submission> getStudentSubmissions(Integer studentId) {
        return submissionRepo.findByStudent_StudentId(studentId);
    }

    public List<Submission> getAssignmentSubmissions(Integer assignmentId) {
        return submissionRepo.findByAssignment_AssignmentId(assignmentId);
    }

    public String gradeSubmission(Integer submissionId, Integer marks, String feedback) {
        Optional<Submission> opt = submissionRepo.findById(submissionId);
        if (opt.isEmpty()) return "Submission not found!";

        Submission submission = opt.get();
        submission.setMarksObtained(marks);
        submission.setFeedback(feedback);
        submissionRepo.save(submission);

        // Update assignment marks in result
        Integer studentId = submission.getStudent().getStudentId();
        Integer courseId = submission.getAssignment().getCourse().getCourseId();

        resultService.updateAssignmentMarks(studentId, courseId, marks);

        return "Submission graded successfully!";
    }

    private String calculateGrade(Integer marksObtained, Integer totalMarks) {
        if (totalMarks == null || totalMarks == 0) return "N/A";
        double percentage = (marksObtained * 100.0) / totalMarks;
        
        if (percentage >= 90) return "A";
        if (percentage >= 80) return "B";
        if (percentage >= 70) return "C";
        if (percentage >= 60) return "D";
        return "F";
    }

    public Optional<Submission> getSubmissionById(Integer submissionId) {
        return submissionRepo.findById(submissionId);
    }
}
