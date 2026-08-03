package com.coaching.service;

import com.coaching.entities.Student;
import com.coaching.entities.User;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.UserRepository;
import com.coaching.repository.EnrollmentRepository;
import com.coaching.repository.LectureRepository;
import com.coaching.repository.QuizSubmissionRepository;
import com.coaching.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private LectureRepository lectureRepo;
    @Autowired private QuizSubmissionRepository quizSubmissionRepo;
    @Autowired private AssignmentRepository assignmentRepo;

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public Optional<Student> getStudentById(Integer studentId) {
        return studentRepo.findById(studentId);
    }

    public String updateStudent(Integer studentId, Student studentData) {
        Optional<Student> opt = studentRepo.findById(studentId);
        if (opt.isEmpty()) return "Student not found!";

        Student student = opt.get();
        User user = student.getUser();
        
        if (user == null) return "User not found for this student!";

        // Update user fields if provided in the nested user object
        if (studentData.getUser() != null) {
            if (studentData.getUser().getEmail() != null && !studentData.getUser().getEmail().isEmpty()) {
                if (!studentData.getUser().getEmail().equals(user.getEmail())) {
                    if (userRepo.existsByEmail(studentData.getUser().getEmail()))
                        return "Email already in use!";
                    user.setEmail(studentData.getUser().getEmail());
                }
            }
            if (studentData.getUser().getName() != null && !studentData.getUser().getName().isEmpty()) {
                user.setName(studentData.getUser().getName());
            }
            if (studentData.getUser().getPassword() != null && !studentData.getUser().getPassword().isEmpty()) {
                user.setPassword(studentData.getUser().getPassword());
            }
        }
        
        if (studentData.getPhone() != null) student.setPhone(studentData.getPhone());
        if (studentData.getAddress() != null) student.setAddress(studentData.getAddress());
        if (studentData.getBio() != null) student.setBio(studentData.getBio());
        if (studentData.getProfilePicture() != null) student.setProfilePicture(studentData.getProfilePicture());
        if (studentData.getDob() != null) student.setDob(studentData.getDob());
        
        studentRepo.save(student);
        userRepo.save(user);
        return "Student updated successfully!";
    }

    @Transactional
    public String deleteStudent(Integer studentId) {
        Optional<Student> opt = studentRepo.findById(studentId);
        if (opt.isEmpty()) return "Student not found!";

        Integer userId = opt.get().getUser() != null ? opt.get().getUser().getUserId() : null;

        // Delete student first to avoid foreign key constraint
        studentRepo.deleteById(studentId);

        // Then delete the user if exists
        if (userId != null) {
            userRepo.deleteById(userId);
        }

        return "Student deleted successfully!";
    }

    public Object getStudentDashboard(Integer studentId) {
        Optional<Student> student = studentRepo.findById(studentId);
        if (student.isEmpty()) return "Student not found!";

        // Get student's enrollments
        List<com.coaching.entities.Enrollment> enrollments = enrollmentRepo.findByStudent_StudentId(studentId);

        // Calculate stats
        int totalLectures = 0;
        int pendingAssignments = 0;
        double averageQuizScore = 0.0;

        for (com.coaching.entities.Enrollment enrollment : enrollments) {
            if (enrollment.getCourse() != null) {
                // Count total lectures for this course
                List<com.coaching.entities.Lecture> lectures = lectureRepo.findByCourse_CourseId(enrollment.getCourse().getCourseId());
                totalLectures += lectures.size();

                // Count assignments for this course (all are considered pending for simplicity)
                // In a real system, you'd check which ones have been submitted
                List<com.coaching.entities.Assignment> assignments = assignmentRepo.findByCourse_CourseId(enrollment.getCourse().getCourseId());
                pendingAssignments += assignments.size();
            }
        }

        // Calculate average quiz score
        List<com.coaching.entities.QuizSubmission> quizSubmissions = quizSubmissionRepo.findByStudent_StudentId(studentId);
        if (!quizSubmissions.isEmpty()) {
            double sum = quizSubmissions.stream()
                .mapToDouble(com.coaching.entities.QuizSubmission::getScore)
                .sum();
            averageQuizScore = sum / quizSubmissions.size();
        }

        // Create dashboard response with stats
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("student", student.get());
        dashboard.put("enrolledCourses", enrollments.size());
        dashboard.put("totalLectures", totalLectures);
        dashboard.put("completedLectures", totalLectures); // Simplified - all lectures count as completed
        dashboard.put("pendingAssignments", pendingAssignments);
        dashboard.put("averageQuizScore", averageQuizScore);

        return dashboard;
    }

    public Object getStudentByUserId(Integer userId) {
        Optional<Student> student = studentRepo.findByUser_UserId(userId);
        if (student.isEmpty()) return Optional.empty();
        
        // Get student's enrollments
        List<com.coaching.entities.Enrollment> enrollments = enrollmentRepo.findByStudent_StudentId(student.get().getStudentId());
        
        // Calculate stats
        int completedLectures = 0;
        
        for (com.coaching.entities.Enrollment enrollment : enrollments) {
            if (enrollment.getCourse() != null) {
                // Count lectures for this course
                List<com.coaching.entities.Lecture> lectures = lectureRepo.findByCourse_CourseId(enrollment.getCourse().getCourseId());
                completedLectures += lectures.size();
            }
        }
        
        // Create response with student and stats
        Map<String, Object> response = new HashMap<>();
        response.put("studentId", student.get().getStudentId());
        response.put("user", student.get().getUser());
        response.put("phone", student.get().getPhone());
        response.put("address", student.get().getAddress());
        response.put("bio", student.get().getBio());
        response.put("profilePicture", student.get().getProfilePicture());
        response.put("dob", student.get().getDob());
        response.put("joinDate", student.get().getJoinDate());
        response.put("enrolledCourses", enrollments.size());
        response.put("completedLectures", completedLectures);
        response.put("certificates", 0); // TODO: Implement certificate counting
        
        return response;
    }
}
