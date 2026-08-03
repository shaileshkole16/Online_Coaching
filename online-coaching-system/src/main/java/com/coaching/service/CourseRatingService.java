package com.coaching.service;

import com.coaching.entities.CourseRating;
import com.coaching.entities.Student;
import com.coaching.entities.Course;
import com.coaching.repository.CourseRatingRepository;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CourseRatingService {

    @Autowired private CourseRatingRepository ratingRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;

    public String submitRating(Integer studentId, Integer courseId, Integer rating, String comment) {
        Optional<Student> student = studentRepo.findById(studentId);
        Optional<Course> course = courseRepo.findById(courseId);

        if (student.isEmpty()) return "Student not found!";
        if (course.isEmpty()) return "Course not found!";
        if (rating < 1 || rating > 5) return "Rating must be between 1 and 5!";

        // Check if student is enrolled in the course
        if (!enrollmentRepo.existsByStudent_StudentIdAndCourse_CourseId(studentId, courseId))
            return "Student must be enrolled in the course to rate it!";

        if (ratingRepo.existsByStudent_StudentIdAndCourse_CourseId(studentId, courseId))
            return "You have already rated this course!";

        CourseRating newRating = new CourseRating();
        newRating.setStudent(student.get());
        newRating.setCourse(course.get());
        newRating.setRating(rating);
        newRating.setComment(comment);
        newRating.setRatingDate(LocalDate.now());
        
        ratingRepo.save(newRating);
        return "Rating submitted successfully!";
    }

    public List<CourseRating> getCourseRatings(Integer courseId) {
        return ratingRepo.findByCourse_CourseId(courseId);
    }

    public Optional<CourseRating> getStudentRatingForCourse(Integer studentId, Integer courseId) {
        return ratingRepo.findByStudent_StudentIdAndCourse_CourseId(studentId, courseId);
    }

    public Double calculateAverageRating(Integer courseId) {
        List<CourseRating> ratings = ratingRepo.findByCourse_CourseId(courseId);
        if (ratings.isEmpty()) return 0.0;
        
        double sum = ratings.stream().mapToInt(CourseRating::getRating).sum();
        return sum / ratings.size();
    }

    public List<CourseRating> getTeacherCourseRatings(Integer teacherId) {
        return ratingRepo.findByCourse_Teacher_TeacherId(teacherId);
    }

    public String updateRating(Integer ratingId, Integer rating, String comment) {
        Optional<CourseRating> opt = ratingRepo.findById(ratingId);
        if (opt.isEmpty()) return "Rating not found!";

        CourseRating ratingObj = opt.get();
        if (rating != null && rating >= 1 && rating <= 5) ratingObj.setRating(rating);
        if (comment != null) ratingObj.setComment(comment);
        
        ratingRepo.save(ratingObj);
        return "Rating updated successfully!";
    }

    public String deleteRating(Integer ratingId) {
        if (!ratingRepo.existsById(ratingId)) return "Rating not found!";
        ratingRepo.deleteById(ratingId);
        return "Rating deleted successfully!";
    }
}
