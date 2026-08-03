package com.coaching.service;

import com.coaching.dto.CourseRequest;
import com.coaching.dto.CourseResponse;
import com.coaching.entities.Course;
import com.coaching.entities.Teacher;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.TeacherRepository;
import com.coaching.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired private CourseRepository courseRepo;
    @Autowired private TeacherRepository teacherRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;

    public String createCourse(CourseRequest req) {
        Optional<Teacher> teacher = teacherRepo.findById(req.getTeacherId());
        if (teacher.isEmpty()) return "Teacher not found!";
        
        if (courseRepo.existsByTitleAndTeacher_TeacherId(req.getTitle(), req.getTeacherId()))
            return "Course with this title already exists for this teacher!";

        Course course = new Course();
        course.setTitle(req.getTitle());
        course.setDescription(req.getDescription());
        course.setDuration(req.getDuration());
        course.setLevel(req.getLevel());
        course.setPrice(req.getPrice());
        course.setCreatedDate(req.getCreatedDate() != null ? req.getCreatedDate() : LocalDate.now());
        course.setTeacher(teacher.get());
        courseRepo.save(course);
        return "Course created successfully! Course ID: " + course.getCourseId();
    }

    public List<CourseResponse> getAllCourses() {
        return courseRepo.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private CourseResponse convertToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getCourseId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setDuration(course.getDuration());
        response.setLevel(course.getLevel());
        response.setPrice(course.getPrice());
        response.setCreatedDate(course.getCreatedDate());
        if (course.getTeacher() != null) {
            response.setTeacherId(course.getTeacher().getTeacherId());
            response.setTeacherName(course.getTeacher().getUser() != null ? 
                    course.getTeacher().getUser().getName() : "Unknown");
        }
        
        // Get enrollment count for this course
        List<com.coaching.entities.Enrollment> enrollments = enrollmentRepo.findByCourse_CourseId(course.getCourseId());
        response.setEnrolledCount(enrollments.size());
        
        return response;
    }

    public Optional<CourseResponse> getCourseById(Integer courseId) {
        Optional<Course> course = courseRepo.findById(courseId);
        if (course.isEmpty()) return Optional.empty();
        return Optional.of(convertToResponse(course.get()));
    }

    public List<CourseResponse> getCoursesByTeacher(Integer teacherId) {
        return courseRepo.findByTeacher_TeacherId(teacherId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public String updateCourse(Integer courseId, CourseRequest req) {
        Optional<Course> opt = courseRepo.findById(courseId);
        if (opt.isEmpty()) return "Course not found!";

        Course course = opt.get();
        course.setTitle(req.getTitle());
        course.setDescription(req.getDescription());
        course.setDuration(req.getDuration());
        course.setLevel(req.getLevel());
        course.setPrice(req.getPrice());
        if (req.getCreatedDate() != null) {
            course.setCreatedDate(req.getCreatedDate());
        }
        courseRepo.save(course);
        return "Course updated successfully!";
    }

    public String deleteCourse(Integer courseId) {
        if (!courseRepo.existsById(courseId)) return "Course not found!";
        courseRepo.deleteById(courseId);
        return "Course deleted successfully!";
    }
}
