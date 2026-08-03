package com.coaching.service;

import com.coaching.entities.Result;
import com.coaching.entities.Student;
import com.coaching.entities.Course;
import com.coaching.repository.ResultRepository;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ResultService {

    @Autowired private ResultRepository resultRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private CourseRepository courseRepo;

    public String generateResult(Integer studentId, Integer courseId, Integer totalMarks, String grade) {
        Optional<Student> student = studentRepo.findById(studentId);
        Optional<Course> course = courseRepo.findById(courseId);
        
        if (student.isEmpty()) return "Student not found!";
        if (course.isEmpty()) return "Course not found!";
        if (resultRepo.existsByStudent_StudentIdAndCourse_CourseId(studentId, courseId))
            return "Result already exists for this student and course!";

        Result result = new Result();
        result.setStudent(student.get());
        result.setCourse(course.get());
        result.setTotalMarks(totalMarks);
        result.setGrade(grade);
        result.setResultDate(LocalDate.now());
        
        resultRepo.save(result);
        return "Result generated successfully! Result ID: " + result.getResultId();
    }

    public List<Result> getStudentResults(Integer studentId) {
        return resultRepo.findByStudent_StudentId(studentId);
    }

    public List<Result> getCourseResults(Integer courseId) {
        return resultRepo.findByCourse_CourseId(courseId);
    }

    public Optional<Result> getResultById(Integer resultId) {
        return resultRepo.findById(resultId);
    }

    public String updateResult(Integer resultId, Integer totalMarks, String grade) {
        Optional<Result> opt = resultRepo.findById(resultId);
        if (opt.isEmpty()) return "Result not found!";

        Result result = opt.get();
        if (totalMarks != null) result.setTotalMarks(totalMarks);
        if (grade != null) result.setGrade(grade);
        
        resultRepo.save(result);
        return "Result updated successfully!";
    }

    public String updateResultByStudentAndCourse(Integer studentId, Integer courseId, Integer totalMarks, String grade) {
        Optional<Result> opt = resultRepo.findByStudent_StudentIdAndCourse_CourseId(studentId, courseId);
        if (opt.isEmpty()) return "Result not found!";

        Result result = opt.get();
        if (totalMarks != null) result.setTotalMarks(totalMarks);
        if (grade != null) result.setGrade(grade);

        resultRepo.save(result);
        return "Result updated successfully!";
    }

    public String updateAssignmentMarks(Integer studentId, Integer courseId, Integer assignmentMarks) {
        Optional<Result> opt = resultRepo.findByStudent_StudentIdAndCourse_CourseId(studentId, courseId);
        Result result;

        if (opt.isEmpty()) {
            // Create new result if doesn't exist
            Optional<Student> student = studentRepo.findById(studentId);
            Optional<Course> course = courseRepo.findById(courseId);
            if (student.isEmpty() || course.isEmpty()) return "Student or Course not found!";

            result = new Result();
            result.setStudent(student.get());
            result.setCourse(course.get());
            result.setResultDate(LocalDate.now());
        } else {
            result = opt.get();
        }

        result.setAssignmentMarks(assignmentMarks);
        // Recalculate total marks based on assignment and quiz scores
        recalculateTotalMarks(result);
        resultRepo.save(result);
        return "Assignment marks updated successfully!";
    }

    public String updateQuizScore(Integer studentId, Integer courseId, Integer quizScore) {
        Optional<Result> opt = resultRepo.findByStudent_StudentIdAndCourse_CourseId(studentId, courseId);
        Result result;

        if (opt.isEmpty()) {
            // Create new result if doesn't exist
            Optional<Student> student = studentRepo.findById(studentId);
            Optional<Course> course = courseRepo.findById(courseId);
            if (student.isEmpty() || course.isEmpty()) return "Student or Course not found!";

            result = new Result();
            result.setStudent(student.get());
            result.setCourse(course.get());
            result.setResultDate(LocalDate.now());
        } else {
            result = opt.get();
        }

        result.setQuizScore(quizScore);
        // Recalculate total marks based on assignment and quiz scores
        recalculateTotalMarks(result);
        resultRepo.save(result);
        return "Quiz score updated successfully!";
    }

    private void recalculateTotalMarks(Result result) {
        Integer assignmentMarks = result.getAssignmentMarks();
        Integer quizScore = result.getQuizScore();

        if (assignmentMarks != null && quizScore != null) {
            // Average of assignment marks and quiz score
            result.setTotalMarks((assignmentMarks + quizScore) / 2);
        } else if (assignmentMarks != null) {
            result.setTotalMarks(assignmentMarks);
        } else if (quizScore != null) {
            result.setTotalMarks(quizScore);
        }

        // Recalculate grade based on total marks
        if (result.getTotalMarks() != null) {
            result.setGrade(calculateGrade(result.getTotalMarks()));
        }
    }

    private String calculateGrade(Integer totalMarks) {
        if (totalMarks >= 90) return "A";
        if (totalMarks >= 80) return "B";
        if (totalMarks >= 70) return "C";
        if (totalMarks >= 60) return "D";
        if (totalMarks >= 35) return "E";
        return "F";
    }

    public String deleteResult(Integer resultId) {
        if (!resultRepo.existsById(resultId)) return "Result not found!";
        resultRepo.deleteById(resultId);
        return "Result deleted successfully!";
    }
}
