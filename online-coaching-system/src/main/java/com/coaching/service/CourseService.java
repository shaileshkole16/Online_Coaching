package com.coaching.service;

import com.coaching.dto.CourseRequest;
import com.coaching.dto.CourseResponse;
import com.coaching.entities.Course;
import com.coaching.entities.Teacher;
import com.coaching.entities.Enrollment;
import com.coaching.entities.Result;
import com.coaching.entities.Assignment;
import com.coaching.entities.Submission;
import com.coaching.entities.Lecture;
import com.coaching.entities.StudyMaterial;
import com.coaching.entities.CourseRating;
import com.coaching.entities.Quiz;
import com.coaching.entities.QuizSubmission;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.TeacherRepository;
import com.coaching.repository.EnrollmentRepository;
import com.coaching.repository.ResultRepository;
import com.coaching.repository.AssignmentRepository;
import com.coaching.repository.SubmissionRepository;
import com.coaching.repository.LectureRepository;
import com.coaching.repository.StudyMaterialRepository;
import com.coaching.repository.CourseRatingRepository;
import com.coaching.repository.QuizRepository;
import com.coaching.repository.QuizSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired private CourseRepository courseRepo;
    @Autowired private TeacherRepository teacherRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private ResultRepository resultRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private SubmissionRepository submissionRepo;
    @Autowired private LectureRepository lectureRepo;
    @Autowired private StudyMaterialRepository studyMaterialRepo;
    @Autowired private CourseRatingRepository courseRatingRepo;
    @Autowired private QuizRepository quizRepo;
    @Autowired private QuizSubmissionRepository quizSubmissionRepo;

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

    @Transactional
    public String deleteCourse(Integer courseId) {
        if (!courseRepo.existsById(courseId)) return "Course not found!";
        
        try {
            // Delete assignments for this course first (to avoid foreign key constraint)
            var assignments = assignmentRepo.findByCourse_CourseId(courseId);
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
            var lectures = lectureRepo.findByCourse_CourseId(courseId);
            for (var lecture : lectures) {
                lectureRepo.deleteById(lecture.getLectureId());
            }
            
            // Delete study materials for this course (to avoid foreign key constraint)
            var studyMaterials = studyMaterialRepo.findByCourse_CourseId(courseId);
            for (var studyMaterial : studyMaterials) {
                studyMaterialRepo.deleteById(studyMaterial.getMaterialId());
            }
            
            // Delete course ratings for this course (to avoid foreign key constraint)
            var courseRatings = courseRatingRepo.findByCourse_CourseId(courseId);
            for (var courseRating : courseRatings) {
                courseRatingRepo.deleteById(courseRating.getRatingId());
            }
            
            // Delete quizzes for this course
            var quizzes = quizRepo.findByCourse_CourseId(courseId);
            for (var quiz : quizzes) {
                // Delete quiz submissions for this quiz first
                var quizSubmissions = quizSubmissionRepo.findByQuiz_QuizId(quiz.getQuizId());
                for (var quizSubmission : quizSubmissions) {
                    quizSubmissionRepo.deleteById(quizSubmission.getSubmissionId());
                }
                // Delete the quiz
                quizRepo.deleteById(quiz.getQuizId());
            }
            
            // Delete enrollments for this course (to avoid foreign key constraint)
            var enrollments = enrollmentRepo.findByCourse_CourseId(courseId);
            for (var enrollment : enrollments) {
                enrollmentRepo.deleteById(enrollment.getEnrollId());
            }
            
            // Delete results for this course (to avoid foreign key constraint)
            var results = resultRepo.findByCourse_CourseId(courseId);
            for (var result : results) {
                resultRepo.deleteById(result.getResultId());
            }
            
            // Delete the course
            courseRepo.deleteById(courseId);
            return "Course deleted successfully!";
        } catch (Exception e) {
            return "Error deleting course: " + e.getMessage();
        }
    }
}
