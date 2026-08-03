package com.coaching.service;

import com.coaching.dto.AdminDashboardResponse;
import com.coaching.dto.AuthResponse;
import com.coaching.entities.Student;
import com.coaching.entities.Teacher;
import com.coaching.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AdminService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private TeacherRepository teacherRepo;
    @Autowired private AdminRepository adminRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private UserRepository userRepo;

    public AdminDashboardResponse getDashboard() {
        return buildDashboard("Dashboard loaded successfully!");
    }

    // ✅ Get All Students
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    // ✅ Get All Teachers
    public List<Teacher> getAllTeachers() {
        return teacherRepo.findAll();
    }

    // ✅ Delete Student (Block/Remove User)
    @Transactional
    public AuthResponse deleteStudent(Integer studentId) {
        var student = studentRepo.findById(studentId);
        if (student.isEmpty())
            return new AuthResponse(null, null, null, "Student not found!", null, null);
        
        Integer userId = student.get().getUser() != null ? student.get().getUser().getUserId() : null;
        
        // Delete student first to avoid foreign key constraint
        studentRepo.deleteById(studentId);
        
        // Then delete the user if exists
        if (userId != null) {
            userRepo.deleteById(userId);
        }
        
        return new AuthResponse(null, null, null, "Student deleted/blocked successfully!", null, null);
    }

    @Transactional
    public AuthResponse deleteTeacher(Integer teacherId) {
        var teacher = teacherRepo.findById(teacherId);
        if (teacher.isEmpty())
            return new AuthResponse(null, null, null, "Teacher not found!", null, null);
        
        Integer userId = teacher.get().getUser() != null ? teacher.get().getUser().getUserId() : null;
        
        // Delete courses associated with this teacher first
        var courses = courseRepo.findByTeacher_TeacherId(teacherId);
        for (var course : courses) {
            courseRepo.deleteById(course.getCourseId());
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
    }

    public AdminDashboardResponse getAnalytics() {
        return buildDashboard("Analytics fetched successfully!");
    }

    private AdminDashboardResponse buildDashboard(String message) {
        return new AdminDashboardResponse(
                (int) studentRepo.count(),
                (int) teacherRepo.count(),
                (int) courseRepo.count(),
                (int) adminRepo.count(),
                message);
    }
}