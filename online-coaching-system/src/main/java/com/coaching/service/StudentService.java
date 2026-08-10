package com.coaching.service;

import com.coaching.dto.StudentResponse;
import com.coaching.entities.Student;
import com.coaching.entities.User;
import com.coaching.entities.Submission;
import com.coaching.entities.LectureProgress;
import com.coaching.entities.Quiz;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.UserRepository;
import com.coaching.repository.EnrollmentRepository;
import com.coaching.repository.LectureRepository;
import com.coaching.repository.QuizSubmissionRepository;
import com.coaching.repository.QuizRepository;
import com.coaching.repository.AssignmentRepository;
import com.coaching.repository.SubmissionRepository;
import com.coaching.repository.LectureProgressRepository;
import com.coaching.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private LectureRepository lectureRepo;
    @Autowired private QuizSubmissionRepository quizSubmissionRepo;
    @Autowired private QuizRepository quizRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private SubmissionRepository submissionRepo;
    @Autowired private LectureProgressRepository lectureProgressRepo;
    @Autowired private ResultRepository resultRepo;

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }
    
    public List<StudentResponse> getAllStudentsResponse() {
        return studentRepo.findAll().stream()
            .map(this::mapToStudentResponse)
            .collect(Collectors.toList());
    }
    
    private StudentResponse mapToStudentResponse(Student student) {
        StudentResponse response = new StudentResponse();
        response.setStudentId(student.getStudentId());
        response.setPhone(student.getPhone());
        response.setAddress(student.getAddress());
        response.setBio(student.getBio());
        response.setProfilePicture(student.getProfilePicture());
        response.setDob(student.getDob());
        response.setJoinDate(student.getJoinDate());
        
        if (student.getUser() != null) {
            response.setName(student.getUser().getName());
            response.setEmail(student.getUser().getEmail());
        }
        
        return response;
    }

    public Optional<Student> getStudentById(Integer studentId) {
        return studentRepo.findById(studentId);
    }

    public String updateStudent(Integer studentId, Student studentData) {
        try {
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
        } catch (Exception e) {
            System.err.println("Error updating student: " + e.getMessage());
            e.printStackTrace();
            return "Error updating student: " + e.getMessage();
        }
    }

    @Transactional
    public String deleteStudent(Integer studentId) {
        try {
            Optional<Student> opt = studentRepo.findById(studentId);
            if (opt.isEmpty()) return "Student not found!";

            Integer userId = opt.get().getUser() != null ? opt.get().getUser().getUserId() : null;

            // Delete enrollments first to avoid foreign key constraint
            try {
                var enrollments = enrollmentRepo.findByStudent_StudentId(studentId);
                for (var enrollment : enrollments) {
                    enrollmentRepo.deleteById(enrollment.getEnrollId());
                }
            } catch (Exception e) {
                System.err.println("Error deleting enrollments: " + e.getMessage());
            }

            // Delete quiz submissions
            try {
                var quizSubmissions = quizSubmissionRepo.findByStudent_StudentId(studentId);
                for (var submission : quizSubmissions) {
                    quizSubmissionRepo.deleteById(submission.getSubmissionId());
                }
            } catch (Exception e) {
                System.err.println("Error deleting quiz submissions: " + e.getMessage());
            }

            // Delete assignment submissions
            try {
                var submissions = submissionRepo.findByStudent_StudentId(studentId);
                for (var submission : submissions) {
                    submissionRepo.deleteById(submission.getSubmissionId());
                }
            } catch (Exception e) {
                System.err.println("Error deleting submissions: " + e.getMessage());
            }

            // Delete results for this student
            try {
                var results = resultRepo.findByStudent_StudentId(studentId);
                for (var result : results) {
                    resultRepo.deleteById(result.getResultId());
                }
            } catch (Exception e) {
                System.err.println("Error deleting results: " + e.getMessage());
            }

            // Delete student first to avoid foreign key constraint
            studentRepo.deleteById(studentId);

            // Then delete the user if exists
            if (userId != null) {
                userRepo.deleteById(userId);
            }

            return "Student deleted successfully!";
        } catch (Exception e) {
            System.err.println("Error deleting student: " + e.getMessage());
            e.printStackTrace();
            return "Error deleting student: " + e.getMessage();
        }
    }

    public Object getStudentDashboard(Integer studentId) {
        Optional<Student> student = studentRepo.findById(studentId);
        if (student.isEmpty()) return "Student not found!";

        // Get student's enrollments
        List<com.coaching.entities.Enrollment> enrollments = enrollmentRepo.findByStudent_StudentId(studentId);

        // Calculate stats
        int totalLectures = 0;
        int completedLectures = 0;
        int pendingAssignments = 0;
        int completedAssignments = 0;
        int completedQuizzes = 0;
        double averageQuizScore = 0.0;

        for (com.coaching.entities.Enrollment enrollment : enrollments) {
            if (enrollment.getCourse() != null) {
                // Count total lectures for this course
                List<com.coaching.entities.Lecture> lectures = lectureRepo.findByCourse_CourseId(enrollment.getCourse().getCourseId());
                totalLectures += lectures.size();

                // Count completed lectures for this course
                List<LectureProgress> lectureProgress = lectureProgressRepo.findByStudent_StudentIdAndLecture_Course_CourseId(studentId, enrollment.getCourse().getCourseId());
                completedLectures += lectureProgress.stream().filter(lp -> lp.getWatched() != null && lp.getWatched()).count();

                // Count assignments for this course
                List<com.coaching.entities.Assignment> assignments = assignmentRepo.findByCourse_CourseId(enrollment.getCourse().getCourseId());
                
                // For each assignment, check if student has submitted it
                for (com.coaching.entities.Assignment assignment : assignments) {
                    boolean hasSubmitted = submissionRepo.existsByAssignment_AssignmentIdAndStudent_StudentId(
                        assignment.getAssignmentId(), studentId
                    );
                    if (hasSubmitted) {
                        completedAssignments++;
                    } else {
                        pendingAssignments++;
                    }
                }

                // Count completed quizzes for this course
                List<com.coaching.entities.Quiz> quizzes = quizRepo.findByCourse_CourseId(enrollment.getCourse().getCourseId());
                for (com.coaching.entities.Quiz quiz : quizzes) {
                    boolean hasAttempted = quizSubmissionRepo.existsByQuiz_QuizIdAndStudent_StudentId(quiz.getQuizId(), studentId);
                    if (hasAttempted) {
                        completedQuizzes++;
                    }
                }
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

        // Calculate overall progress percentage
        int totalTasks = totalLectures + completedAssignments + pendingAssignments + completedQuizzes;
        int completedTasks = completedLectures + completedAssignments + completedQuizzes;
        double overallProgress = totalTasks > 0 ? (completedTasks * 100.0) / totalTasks : 0;

        // Create dashboard response with stats
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("studentId", student.get().getStudentId());
        dashboard.put("name", student.get().getUser() != null ? student.get().getUser().getName() : null);
        dashboard.put("email", student.get().getUser() != null ? student.get().getUser().getEmail() : null);
        dashboard.put("phone", student.get().getPhone());
        dashboard.put("address", student.get().getAddress());
        dashboard.put("bio", student.get().getBio());
        dashboard.put("profilePicture", student.get().getProfilePicture());
        dashboard.put("dob", student.get().getDob());
        dashboard.put("joinDate", student.get().getJoinDate());
        dashboard.put("enrolledCourses", enrollments.size());
        dashboard.put("totalLectures", totalLectures);
        dashboard.put("completedLectures", completedLectures);
        dashboard.put("pendingAssignments", pendingAssignments);
        dashboard.put("completedAssignments", completedAssignments);
        dashboard.put("completedQuizzes", completedQuizzes);
        dashboard.put("averageQuizScore", averageQuizScore);
        dashboard.put("overallProgress", overallProgress);

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
        response.put("name", student.get().getUser() != null ? student.get().getUser().getName() : null);
        response.put("email", student.get().getUser() != null ? student.get().getUser().getEmail() : null);
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
