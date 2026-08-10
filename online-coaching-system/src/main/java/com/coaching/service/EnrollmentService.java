package com.coaching.service;

import com.coaching.entities.Enrollment;
import com.coaching.entities.Student;
import com.coaching.entities.Course;
import java.math.BigDecimal;
import com.coaching.repository.EnrollmentRepository;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private CourseRepository courseRepo;

    public String enrollStudent(Integer studentId, Integer courseId) {
        Optional<Student> student = studentRepo.findById(studentId);
        Optional<Course> course = courseRepo.findById(courseId);
        
        if (student.isEmpty()) return "Student not found!";
        if (course.isEmpty()) return "Course not found!";
        if (enrollmentRepo.existsByStudent_StudentIdAndCourse_CourseId(studentId, courseId))
            return "Student is already enrolled in this course!";

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student.get());
        enrollment.setCourse(course.get());
        enrollment.setEnrollDate(LocalDate.now());
        enrollment.setStatus("active");
        enrollment.setPlanType("standard");
        
        // Set amount paid to course price, default to null if course has no price
        if (course.get().getPrice() != null && course.get().getPrice().doubleValue() > 0) {
            enrollment.setAmountPaid(course.get().getPrice().doubleValue());
        } else {
            enrollment.setAmountPaid(null); // This will indicate it's free
        }
        
        enrollmentRepo.save(enrollment);
        return "Student enrolled successfully! Enrollment ID: " + enrollment.getEnrollId();
    }

    public List<Enrollment> getStudentEnrollments(Integer studentId) {
        return enrollmentRepo.findByStudent_StudentId(studentId);
    }

    public List<Enrollment> getCourseStudents(Integer courseId) {
        return enrollmentRepo.findByCourse_CourseId(courseId);
    }

    public String cancelEnrollment(Integer enrollmentId) {
        Optional<Enrollment> opt = enrollmentRepo.findById(enrollmentId);
        if (opt.isEmpty()) return "Enrollment not found!";

        Enrollment enrollment = opt.get();
        enrollment.setStatus("cancelled");
        enrollmentRepo.save(enrollment);
        return "Enrollment cancelled successfully!";
    }

    public Optional<Enrollment> getEnrollmentById(Integer enrollmentId) {
        return enrollmentRepo.findById(enrollmentId);
    }
}
