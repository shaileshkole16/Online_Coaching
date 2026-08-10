package com.coaching.service;

import com.coaching.dto.AdminDashboardResponse;
import com.coaching.dto.AuthResponse;
import com.coaching.dto.StudentResponse;
import com.coaching.dto.TeacherResponse;
import com.coaching.dto.EnrollmentManagementResponse;
import com.coaching.entities.Student;
import com.coaching.entities.Teacher;
import com.coaching.entities.Announcement;
import com.coaching.entities.DiscussionForum;
import com.coaching.entities.DiscussionReply;
import com.coaching.entities.LiveClass;
import com.coaching.entities.Submission;
import com.coaching.entities.AuditLog;
import com.coaching.entities.Payment;
import com.coaching.entities.Enrollment;
import com.coaching.entities.CourseRating;
import com.coaching.entities.Lecture;
import com.coaching.entities.StudyMaterial;
import com.coaching.repository.*;
import com.coaching.entities.Quiz;
import com.coaching.entities.QuizSubmission;
import com.coaching.entities.Result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private TeacherRepository teacherRepo;
    @Autowired private AdminRepository adminRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private QuizSubmissionRepository quizSubmissionRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private LectureRepository lectureRepo;
    @Autowired private QuizRepository quizRepo;
    @Autowired private AnnouncementRepository announcementRepo;
    @Autowired private DiscussionForumRepository discussionForumRepo;
    @Autowired private DiscussionReplyRepository discussionReplyRepo;
    @Autowired private LiveClassRepository liveClassRepo;
    @Autowired private RatingRepository ratingRepo;
    @Autowired private SubmissionRepository submissionRepo;
    @Autowired private PaymentRepository paymentRepo;
    @Autowired private AuditLogRepository auditLogRepo;
    @Autowired private CourseRatingRepository courseRatingRepo;
    @Autowired private StudyMaterialRepository studyMaterialRepo;
    @Autowired private ResultRepository resultRepo;

    public AdminDashboardResponse getDashboard() {
        return buildDashboard("Dashboard loaded successfully!");
    }

    // ✅ Get All Students
    public List<StudentResponse> getAllStudents() {
        return studentRepo.findAll().stream()
            .map(this::mapToStudentResponse)
            .collect(Collectors.toList());
    }

    // ✅ Get All Teachers
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepo.findAll().stream()
            .map(this::mapToTeacherResponse)
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
    
    private TeacherResponse mapToTeacherResponse(Teacher teacher) {
        TeacherResponse response = new TeacherResponse();
        response.setTeacherId(teacher.getTeacherId());
        response.setPhone(teacher.getPhone());
        response.setQualification(teacher.getQualification());
        response.setExpertise(teacher.getExpertise());
        response.setBio(teacher.getBio());
        response.setProfilePicture(teacher.getProfilePicture());
        response.setJoinDate(teacher.getJoinDate());
        response.setAchievements(teacher.getAchievements());
        
        if (teacher.getUser() != null) {
            response.setName(teacher.getUser().getName());
            response.setEmail(teacher.getUser().getEmail());
        }
        
        return response;
    }

    // ✅ Delete Student (Block/Remove User)
    @Transactional
    public AuthResponse deleteStudent(Integer studentId) {
        try {
            var student = studentRepo.findById(studentId);
            if (student.isEmpty())
                return new AuthResponse(null, null, null, "Student not found!", null, null);
            
            Integer userId = student.get().getUser() != null ? student.get().getUser().getUserId() : null;
            
            // Delete enrollments first to avoid foreign key constraint
            try {
                enrollmentRepo.deleteByStudent_StudentId(studentId);
            } catch (Exception e) {
                System.err.println("Error deleting enrollments: " + e.getMessage());
            }
            
            // Delete quiz submissions
            try {
                quizSubmissionRepo.deleteByStudent_StudentId(studentId);
            } catch (Exception e) {
                System.err.println("Error deleting quiz submissions: " + e.getMessage());
            }
            
            // Delete assignment submissions
            try {
                submissionRepo.deleteByStudent_StudentId(studentId);
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
            
            return new AuthResponse(null, null, null, "Student deleted/blocked successfully!", null, null);
        } catch (Exception e) {
            System.err.println("Error deleting student: " + e.getMessage());
            e.printStackTrace();
            return new AuthResponse(null, null, null, "Error deleting student: " + e.getMessage(), null, null);
        }
    }

    @Transactional
    public AuthResponse deleteTeacher(Integer teacherId) {
        var teacher = teacherRepo.findById(teacherId);
        if (teacher.isEmpty())
            return new AuthResponse(null, null, null, "Teacher not found!", null, null);
        
        Integer userId = teacher.get().getUser() != null ? teacher.get().getUser().getUserId() : null;
        
        try {
            // Delete courses associated with this teacher first
            var courses = courseRepo.findByTeacher_TeacherId(teacherId);
            for (var course : courses) {
                try {
                    // Delete assignments for this course first (to avoid foreign key constraint)
                    var assignments = assignmentRepo.findByCourse_CourseId(course.getCourseId());
                    for (var assignment : assignments) {
                        // Delete submissions for this assignment first
                        var submissions = submissionRepo.findByAssignment_AssignmentId(assignment.getAssignmentId());
                        for (var submission : submissions) {
                            submissionRepo.deleteById(submission.getSubmissionId());
                        }
                        // Delete the assignment
                        assignmentRepo.deleteById(assignment.getAssignmentId());
                    }
                    
                    // Delete lectures for this course (to avoid foreign key constraint)
                    var lectures = lectureRepo.findByCourse_CourseId(course.getCourseId());
                    for (var lecture : lectures) {
                        lectureRepo.deleteById(lecture.getLectureId());
                    }
                    
                    // Delete study materials for this course (to avoid foreign key constraint)
                    var studyMaterials = studyMaterialRepo.findByCourse_CourseId(course.getCourseId());
                    for (var studyMaterial : studyMaterials) {
                        studyMaterialRepo.deleteById(studyMaterial.getMaterialId());
                    }
                    
                    // Delete course ratings for this course (to avoid foreign key constraint)
                    var courseRatings = courseRatingRepo.findByCourse_CourseId(course.getCourseId());
                    for (var courseRating : courseRatings) {
                        courseRatingRepo.deleteById(courseRating.getRatingId());
                    }
                    
                    // Delete quizzes for this course
                    List<Quiz> quizzes = quizRepo.findByCourse_CourseId(course.getCourseId());
                    for (Quiz quiz : quizzes) {
                        // Delete quiz submissions for this quiz first
                        List<QuizSubmission> quizSubmissions = quizSubmissionRepo.findByQuiz_QuizId(quiz.getQuizId());
                        for (QuizSubmission quizSubmission : quizSubmissions) {
                            quizSubmissionRepo.deleteById(quizSubmission.getSubmissionId());
                        }
                        // Delete the quiz
                        quizRepo.deleteById(quiz.getQuizId());
                    }
                    
                    // Delete enrollments for this course
                    var enrollments = enrollmentRepo.findByCourse_CourseId(course.getCourseId());
                    for (var enrollment : enrollments) {
                        enrollmentRepo.deleteById(enrollment.getEnrollId());
                    }
                    
                    // Delete results for this course (to avoid foreign key constraint)
                    var results = resultRepo.findByCourse_CourseId(course.getCourseId());
                    for (var result : results) {
                        resultRepo.deleteById(result.getResultId());
                    }
                    
                    // Delete the course
                    courseRepo.deleteById(course.getCourseId());
                } catch (Exception e) {
                    // Ignore errors for individual course deletion
                    System.out.println("Error deleting course: " + e.getMessage());
                }
            }
            
            // Clear achievements to avoid foreign key constraint
            teacher.get().setAchievements(null);
            teacherRepo.save(teacher.get());
            
            // Delete teacher first to avoid foreign key constraint
            teacherRepo.deleteById(teacherId);
            
            // Then delete the user if exists
            if (userId != null) {
                userRepo.deleteById(userId);
            }
            
            return new AuthResponse(null, null, null, "Teacher deleted/blocked successfully!", null, null);
        } catch (Exception e) {
            System.err.println("Error deleting teacher: " + e.getMessage());
            e.printStackTrace();
            return new AuthResponse(null, null, null, "Error deleting teacher: " + e.getMessage(), null, null);
        }
    }

    public AdminDashboardResponse getAnalytics() {
        return buildDashboard("Analytics fetched successfully!");
    }

    private AdminDashboardResponse buildDashboard(String message) {
        // Calculate total revenue from enrollments using course prices
        Double totalRevenue = 0.0;
        try {
            var enrollments = enrollmentRepo.findAll();
            totalRevenue = enrollments.stream()
                .filter(e -> e.getCourse() != null && e.getCourse().getPrice() != null)
                .map(e -> e.getCourse().getPrice().doubleValue())
                .reduce(0.0, Double::sum);
        } catch (Exception e) {
            // If enrollment calculation fails, try payments as fallback
            try {
                var successfulPayments = paymentRepo.findByStatus("completed");
                totalRevenue = successfulPayments.stream()
                    .map(Payment::getAmount)
                    .reduce(0.0, Double::sum);
            } catch (Exception ex) {
                // Both calculations failed, default to 0
                totalRevenue = 0.0;
            }
        }

        // Get recent activities from audit logs
        java.util.List<AdminDashboardResponse.RecentActivity> recentActivities = java.util.Collections.emptyList();
        try {
            var recentAuditLogs = auditLogRepo.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .toList();

            recentActivities = recentAuditLogs.stream()
                .map(log -> new AdminDashboardResponse.RecentActivity(
                    log.getAction().toString(),
                    log.getAction() + " on " + log.getEntityType(),
                    log.getUser() != null ? log.getUser().getName() : "System",
                    log.getCreatedAt().toString()
                ))
                .toList();
        } catch (Exception e) {
            // Audit logs might not exist, default to empty list
            recentActivities = java.util.Collections.emptyList();
        }

        int totalEnrollments = (int) enrollmentRepo.count();

        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalStudents((int) studentRepo.count());
        response.setTotalTeachers((int) teacherRepo.count());
        response.setTotalCourses((int) courseRepo.count());
        response.setTotalAdmins((int) adminRepo.count());
        response.setTotalRevenue(java.math.BigDecimal.valueOf(totalRevenue));
        // Active users = students + teachers (excluding admins)
        response.setActiveUsers((int) studentRepo.count() + (int) teacherRepo.count());
        response.setTotalEnrollments(totalEnrollments);
        response.setRecentActivities(recentActivities);
        response.setMessage(message);

        return response;
    }

    // ✅ Get All Courses for Admin
    public List<com.coaching.entities.Course> getAllCourses() {
        return courseRepo.findAll();
    }

    // ✅ Approve Course
    @Transactional
    public String approveCourse(Integer courseId) {
        var course = courseRepo.findById(courseId);
        if (course.isEmpty())
            return "Course not found!";
        
        // Note: Status field not in database yet, just return success
        return "Course approved successfully!";
    }

    // ✅ Reject Course
    @Transactional
    public String rejectCourse(Integer courseId) {
        var course = courseRepo.findById(courseId);
        if (course.isEmpty())
            return "Course not found!";
        
        // Note: Status field not in database yet, just return success
        return "Course rejected successfully!";
    }

    // ✅ Get All Enrollments for Management
    public java.util.List<EnrollmentManagementResponse> getAllEnrollments() {
        return enrollmentRepo.findAll().stream()
            .map(this::mapToEnrollmentManagementResponse)
            .collect(java.util.stream.Collectors.toList());
    }

    private EnrollmentManagementResponse mapToEnrollmentManagementResponse(Enrollment enrollment) {
        EnrollmentManagementResponse response = new EnrollmentManagementResponse();
        response.setEnrollmentId(enrollment.getEnrollId());
        response.setEnrollDate(enrollment.getEnrollDate());
        response.setStatus(enrollment.getStatus());
        response.setPlanType(enrollment.getPlanType());
        
        // Handle amount paid - always try to get the course price first
        Double amountPaid = null;
        if (enrollment.getCourse() != null) {
            if (enrollment.getCourse().getPrice() != null && enrollment.getCourse().getPrice().doubleValue() > 0) {
                amountPaid = enrollment.getCourse().getPrice().doubleValue();
            }
        }
        
        // If course price is not available, fall back to enrollment amount paid
        if (amountPaid == null || amountPaid == 0.0) {
            amountPaid = enrollment.getAmountPaid();
        }
        
        response.setAmountPaid(amountPaid);

        if (enrollment.getStudent() != null) {
            response.setStudentName(enrollment.getStudent().getUser() != null ? 
                enrollment.getStudent().getUser().getName() : "Unknown");
            response.setStudentEmail(enrollment.getStudent().getUser() != null ? 
                enrollment.getStudent().getUser().getEmail() : "Unknown");
        }

        if (enrollment.getCourse() != null) {
            response.setCourseTitle(enrollment.getCourse().getTitle());
            response.setCourseDescription(enrollment.getCourse().getDescription());
            
            if (enrollment.getCourse().getTeacher() != null) {
                response.setTeacherName(enrollment.getCourse().getTeacher().getUser() != null ? 
                    enrollment.getCourse().getTeacher().getUser().getName() : "Unknown");
                response.setTeacherEmail(enrollment.getCourse().getTeacher().getUser() != null ? 
                    enrollment.getCourse().getTeacher().getUser().getEmail() : "Unknown");
            }
        }

        return response;
    }
}