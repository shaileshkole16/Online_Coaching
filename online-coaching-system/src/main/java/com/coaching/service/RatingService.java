package com.coaching.service;

import com.coaching.entities.Rating;
import com.coaching.entities.Student;
import com.coaching.entities.Teacher;
import com.coaching.repository.RatingRepository;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    @Autowired private RatingRepository ratingRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private TeacherRepository teacherRepo;

    public String submitRating(Integer studentId, Integer teacherId, Integer rating, String comment) {
        Optional<Student> student = studentRepo.findById(studentId);
        Optional<Teacher> teacher = teacherRepo.findById(teacherId);

        if (student.isEmpty()) return "Student not found!";
        if (teacher.isEmpty()) return "Teacher not found!";
        if (rating < 1 || rating > 5) return "Rating must be between 1 and 5!";
        if (ratingRepo.existsByStudent_StudentIdAndTeacher_TeacherId(studentId, teacherId))
            return "You have already rated this teacher!";

        Rating newRating = new Rating();
        newRating.setStudent(student.get());
        newRating.setTeacher(teacher.get());
        newRating.setRating(rating);
        newRating.setComment(comment);
        newRating.setRatingDate(LocalDate.now());
        
        ratingRepo.save(newRating);
        return "Rating submitted successfully!";
    }

    public List<Rating> getTeacherRatings(Integer teacherId) {
        return ratingRepo.findByTeacher_TeacherId(teacherId);
    }

    public Optional<Rating> getStudentRatingForTeacher(Integer studentId, Integer teacherId) {
        return ratingRepo.findByStudent_StudentIdAndTeacher_TeacherId(studentId, teacherId);
    }

    public Double calculateAverageRating(Integer teacherId) {
        List<Rating> ratings = ratingRepo.findByTeacher_TeacherId(teacherId);
        if (ratings.isEmpty()) return 0.0;
        
        double sum = ratings.stream().mapToInt(Rating::getRating).sum();
        return sum / ratings.size();
    }

    public String updateRating(Integer ratingId, Integer rating, String comment) {
        Optional<Rating> opt = ratingRepo.findById(ratingId);
        if (opt.isEmpty()) return "Rating not found!";

        Rating ratingObj = opt.get();
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
