package com.coaching.service;

import com.coaching.dto.TeacherResponse;
import com.coaching.entities.Teacher;
import com.coaching.entities.User;
import com.coaching.entities.Announcement;
import com.coaching.entities.DiscussionForum;
import com.coaching.entities.DiscussionReply;
import com.coaching.entities.LiveClass;
import com.coaching.entities.Submission;
import com.coaching.entities.CourseRating;
import com.coaching.entities.Lecture;
import com.coaching.entities.StudyMaterial;
import com.coaching.entities.Quiz;
import com.coaching.entities.QuizSubmission;
import com.coaching.entities.Result;
import com.coaching.repository.TeacherRepository;
import com.coaching.repository.UserRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.EnrollmentRepository;
import com.coaching.repository.LectureRepository;
import com.coaching.repository.RatingRepository;
import com.coaching.repository.CourseRatingRepository;
import com.coaching.repository.AssignmentRepository;
import com.coaching.repository.QuizRepository;
import com.coaching.repository.QuizSubmissionRepository;
import com.coaching.repository.AnnouncementRepository;
import com.coaching.repository.DiscussionForumRepository;
import com.coaching.repository.DiscussionReplyRepository;
import com.coaching.repository.LiveClassRepository;
import com.coaching.repository.SubmissionRepository;
import com.coaching.repository.StudyMaterialRepository;
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
public class TeacherService {

    @Autowired private TeacherRepository teacherRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private LectureRepository lectureRepo;
    @Autowired private RatingRepository ratingRepo;
    @Autowired private CourseRatingRepository courseRatingRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private QuizRepository quizRepo;
    @Autowired private QuizSubmissionRepository quizSubmissionRepo;
    @Autowired private AnnouncementRepository announcementRepo;
    @Autowired private DiscussionForumRepository discussionForumRepo;
    @Autowired private DiscussionReplyRepository discussionReplyRepo;
    @Autowired private LiveClassRepository liveClassRepo;
    @Autowired private SubmissionRepository submissionRepo;
    @Autowired private StudyMaterialRepository studyMaterialRepo;
    @Autowired private ResultRepository resultRepo;

    public List<Teacher> getAllTeachers() {
        return teacherRepo.findAll();
    }
    
    public List<TeacherResponse> getAllTeachersResponse() {
        return teacherRepo.findAll().stream()
            .map(this::mapToTeacherResponse)
            .collect(Collectors.toList());
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

    public Optional<Teacher> getTeacherById(Integer teacherId) {
        return teacherRepo.findById(teacherId);
    }

    public String updateTeacher(Integer teacherId, Teacher teacherData) {
        try {
            Optional<Teacher> opt = teacherRepo.findById(teacherId);
            if (opt.isEmpty()) return "Teacher not found!";

            Teacher teacher = opt.get();
            User user = teacher.getUser();
            
            if (user == null) return "User not found for this teacher!";

            // Update user fields if provided in the nested user object
            if (teacherData.getUser() != null) {
                if (teacherData.getUser().getEmail() != null && !teacherData.getUser().getEmail().isEmpty()) {
                    if (!teacherData.getUser().getEmail().equals(user.getEmail())) {
                        if (userRepo.existsByEmail(teacherData.getUser().getEmail()))
                            return "Email already in use!";
                        user.setEmail(teacherData.getUser().getEmail());
                    }
                }
                if (teacherData.getUser().getName() != null && !teacherData.getUser().getName().isEmpty()) {
                    user.setName(teacherData.getUser().getName());
                }
                if (teacherData.getUser().getPassword() != null && !teacherData.getUser().getPassword().isEmpty()) {
                    user.setPassword(teacherData.getUser().getPassword());
                }
            }
            
            if (teacherData.getPhone() != null) teacher.setPhone(teacherData.getPhone());
            if (teacherData.getQualification() != null) teacher.setQualification(teacherData.getQualification());
            if (teacherData.getExpertise() != null) teacher.setExpertise(teacherData.getExpertise());
            if (teacherData.getBio() != null) teacher.setBio(teacherData.getBio());
            if (teacherData.getProfilePicture() != null) teacher.setProfilePicture(teacherData.getProfilePicture());
            if (teacherData.getAchievements() != null) {
                teacher.setAchievements(teacherData.getAchievements());
            }
            
            teacherRepo.save(teacher);
            userRepo.save(user);
            System.out.println("Teacher updated with achievements: " + teacher.getAchievements());
            return "Teacher updated successfully!";
        } catch (Exception e) {
            System.err.println("Error updating teacher: " + e.getMessage());
            e.printStackTrace();
            return "Error updating teacher: " + e.getMessage();
        }
    }

    @Transactional
    public String deleteTeacher(Integer teacherId) {
        Optional<Teacher> opt = teacherRepo.findById(teacherId);
        if (opt.isEmpty()) return "Teacher not found!";

        Integer userId = opt.get().getUser() != null ? opt.get().getUser().getUserId() : null;

        try {
            // Delete courses associated with this teacher first
            List<com.coaching.entities.Course> courses = courseRepo.findByTeacher_TeacherId(teacherId);
            for (com.coaching.entities.Course course : courses) {
                try {
                    // Delete assignments for this course first (to avoid foreign key constraint)
                    List<com.coaching.entities.Assignment> assignments = assignmentRepo.findByCourse_CourseId(course.getCourseId());
                    for (com.coaching.entities.Assignment assignment : assignments) {
                        // Delete submissions for this assignment first
                        List<com.coaching.entities.Submission> submissions = submissionRepo.findByAssignment_AssignmentId(assignment.getAssignmentId());
                        for (com.coaching.entities.Submission submission : submissions) {
                            submissionRepo.deleteById(submission.getSubmissionId());
                        }
                        // Delete the assignment
                        assignmentRepo.deleteById(assignment.getAssignmentId());
                    }
                    
                    // Delete lectures for this course (to avoid foreign key constraint)
                    List<com.coaching.entities.Lecture> lectures = lectureRepo.findByCourse_CourseId(course.getCourseId());
                    for (com.coaching.entities.Lecture lecture : lectures) {
                        lectureRepo.deleteById(lecture.getLectureId());
                    }
                    
                    // Delete study materials for this course (to avoid foreign key constraint)
                    List<StudyMaterial> studyMaterials = studyMaterialRepo.findByCourse_CourseId(course.getCourseId());
                    for (StudyMaterial studyMaterial : studyMaterials) {
                        studyMaterialRepo.deleteById(studyMaterial.getMaterialId());
                    }
                    
                    // Delete course ratings for this course (to avoid foreign key constraint)
                    List<com.coaching.entities.CourseRating> courseRatings = courseRatingRepo.findByCourse_CourseId(course.getCourseId());
                    for (com.coaching.entities.CourseRating courseRating : courseRatings) {
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
                    List<com.coaching.entities.Enrollment> enrollments = enrollmentRepo.findByCourse_CourseId(course.getCourseId());
                    for (com.coaching.entities.Enrollment enrollment : enrollments) {
                        enrollmentRepo.deleteById(enrollment.getEnrollId());
                    }
                    
                    // Delete results for this course (to avoid foreign key constraint)
                    List<Result> results = resultRepo.findByCourse_CourseId(course.getCourseId());
                    for (Result result : results) {
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
            opt.get().setAchievements(null);
            teacherRepo.save(opt.get());
            
            // Delete teacher first to avoid foreign key constraint
            teacherRepo.deleteById(teacherId);
            
            // Then delete the user if exists
            if (userId != null) {
                userRepo.deleteById(userId);
            }
            
            return "Teacher deleted successfully!";
        } catch (Exception e) {
            System.err.println("Error deleting teacher: " + e.getMessage());
            e.printStackTrace();
            return "Error deleting teacher: " + e.getMessage();
        }
    }

    public Object getTeacherDashboard(Integer teacherId) {
        Optional<Teacher> teacher = teacherRepo.findById(teacherId);
        if (teacher.isEmpty()) return "Teacher not found!";
        
        // Get teacher's courses
        List<com.coaching.entities.Course> courses = courseRepo.findByTeacher_TeacherId(teacherId);
        
        // Count total enrolled students across all courses
        int totalStudents = 0;
        int totalLectures = 0;
        for (com.coaching.entities.Course course : courses) {
            List<com.coaching.entities.Enrollment> enrollments = enrollmentRepo.findByCourse_CourseId(course.getCourseId());
            totalStudents += enrollments.size();
            
            // Count lectures for this course
            List<com.coaching.entities.Lecture> lectures = lectureRepo.findByCourse_CourseId(course.getCourseId());
            totalLectures += lectures.size();
        }
        
        // Calculate average rating from course ratings (calculate per course first, then average)
        List<com.coaching.entities.CourseRating> ratings = courseRatingRepo.findByCourse_Teacher_TeacherId(teacherId);
        double averageRating = 0.0;
        if (!ratings.isEmpty()) {
            // Group ratings by course and calculate average per course
            Map<Integer, List<com.coaching.entities.CourseRating>> ratingsByCourse = ratings.stream()
                .collect(Collectors.groupingBy(rating -> rating.getCourse().getCourseId()));
            
            double sumOfCourseAverages = 0.0;
            for (List<com.coaching.entities.CourseRating> courseRatings : ratingsByCourse.values()) {
                double courseAverage = courseRatings.stream()
                    .mapToInt(com.coaching.entities.CourseRating::getRating)
                    .average()
                    .orElse(0.0);
                sumOfCourseAverages += courseAverage;
            }
            
            averageRating = sumOfCourseAverages / ratingsByCourse.size();
            
            // Debug logging
            System.out.println("Total ratings: " + ratings.size());
            System.out.println("Number of courses with ratings: " + ratingsByCourse.size());
            System.out.println("Sum of course averages: " + sumOfCourseAverages);
            System.out.println("Final average rating: " + averageRating);
        }
        
        // Create dashboard response with stats
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("teacherId", teacher.get().getTeacherId());
        dashboard.put("name", teacher.get().getUser() != null ? teacher.get().getUser().getName() : null);
        dashboard.put("email", teacher.get().getUser() != null ? teacher.get().getUser().getEmail() : null);
        dashboard.put("phone", teacher.get().getPhone());
        dashboard.put("qualification", teacher.get().getQualification());
        dashboard.put("expertise", teacher.get().getExpertise());
        dashboard.put("bio", teacher.get().getBio());
        dashboard.put("profilePicture", teacher.get().getProfilePicture());
        dashboard.put("joinDate", teacher.get().getJoinDate());
        dashboard.put("achievements", teacher.get().getAchievements());
        dashboard.put("totalCourses", courses.size());
        dashboard.put("totalStudents", totalStudents);
        dashboard.put("totalLectures", totalLectures);
        dashboard.put("averageRating", averageRating);
        dashboard.put("totalRatings", ratings.size());
        
        return dashboard;
    }

    public Optional<Teacher> getTeacherByUserId(Integer userId) {
        try {
            return teacherRepo.findByUser_UserId(userId);
        } catch (Exception e) {
            System.err.println("Error fetching teacher by userId " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return Optional.empty();
        }
    }
}
