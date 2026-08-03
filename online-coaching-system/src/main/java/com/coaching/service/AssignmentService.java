package com.coaching.service;

import com.coaching.dto.AssignmentRequest;
import com.coaching.entities.Assignment;
import com.coaching.entities.Course;
import com.coaching.repository.AssignmentRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;

    public String createAssignment(AssignmentRequest req) {
        Optional<Course> course = courseRepo.findById(req.getCourseId());
        if (course.isEmpty()) return "Course not found!";
        
        if (assignmentRepo.existsByTitleAndCourse_CourseId(req.getTitle(), req.getCourseId()))
            return "Assignment with this title already exists in this course!";

        Assignment assignment = new Assignment();
        assignment.setTitle(req.getTitle());
        assignment.setDescription(req.getDescription());
        assignment.setTotalMarks(req.getTotalMarks());
        assignment.setCreatedDate(req.getCreatedDate() != null ? req.getCreatedDate() : LocalDate.now());
        assignment.setDeadline(req.getDeadline());
        assignment.setCourse(course.get());
        assignmentRepo.save(assignment);
        return "Assignment created successfully! Assignment ID: " + assignment.getAssignmentId();
    }

    public List<Assignment> getCourseAssignments(Integer courseId) {
        return assignmentRepo.findByCourse_CourseId(courseId);
    }

    public List<Assignment> getCourseAssignmentsForStudent(Integer courseId, Integer studentId) {
        // Check if student is enrolled in the course
        if (!enrollmentRepo.existsByStudent_StudentIdAndCourse_CourseId(studentId, courseId)) {
            return List.of(); // Return empty list if not enrolled
        }
        return assignmentRepo.findByCourse_CourseId(courseId);
    }

    public Optional<Assignment> getAssignmentById(Integer assignmentId) {
        return assignmentRepo.findById(assignmentId);
    }

    public String updateAssignment(Integer assignmentId, AssignmentRequest req) {
        Optional<Assignment> opt = assignmentRepo.findById(assignmentId);
        if (opt.isEmpty()) return "Assignment not found!";

        Assignment assignment = opt.get();
        assignment.setTitle(req.getTitle());
        assignment.setDescription(req.getDescription());
        assignment.setTotalMarks(req.getTotalMarks());
        if (req.getCreatedDate() != null) {
            assignment.setCreatedDate(req.getCreatedDate());
        }
        if (req.getDeadline() != null) {
            assignment.setDeadline(req.getDeadline());
        }
        assignmentRepo.save(assignment);
        return "Assignment updated successfully!";
    }

    public String deleteAssignment(Integer assignmentId) {
        if (!assignmentRepo.existsById(assignmentId)) return "Assignment not found!";
        assignmentRepo.deleteById(assignmentId);
        return "Assignment deleted successfully!";
    }
}
