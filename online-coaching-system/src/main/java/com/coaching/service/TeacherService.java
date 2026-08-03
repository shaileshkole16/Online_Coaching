package com.coaching.service;

import com.coaching.entities.Teacher;
import com.coaching.entities.User;
import com.coaching.repository.TeacherRepository;
import com.coaching.repository.UserRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.EnrollmentRepository;
import com.coaching.repository.LectureRepository;
import com.coaching.repository.RatingRepository;
import com.coaching.repository.CourseRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired private TeacherRepository teacherRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private LectureRepository lectureRepo;
    @Autowired private RatingRepository ratingRepo;
    @Autowired private CourseRatingRepository courseRatingRepo;

    public List<Teacher> getAllTeachers() {
        return teacherRepo.findAll();
    }

    public Optional<Teacher> getTeacherById(Integer teacherId) {
        return teacherRepo.findById(teacherId);
    }

    public String updateTeacher(Integer teacherId, Teacher teacherData) {
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
    }

    @Transactional
    public String deleteTeacher(Integer teacherId) {
        Optional<Teacher> opt = teacherRepo.findById(teacherId);
        if (opt.isEmpty()) return "Teacher not found!";

        Integer userId = opt.get().getUser() != null ? opt.get().getUser().getUserId() : null;

        // Delete courses associated with this teacher first
        List<com.coaching.entities.Course> courses = courseRepo.findByTeacher_TeacherId(teacherId);
        for (com.coaching.entities.Course course : courses) {
            courseRepo.deleteById(course.getCourseId());
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
        
        // Calculate average rating from course ratings
        List<com.coaching.entities.CourseRating> ratings = courseRatingRepo.findByCourse_Teacher_TeacherId(teacherId);
        double averageRating = 0.0;
        if (!ratings.isEmpty()) {
            double sum = ratings.stream().mapToInt(com.coaching.entities.CourseRating::getRating).sum();
            averageRating = sum / ratings.size();
        }
        
        // Create dashboard response with stats
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("teacher", teacher.get());
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
