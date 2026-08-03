package com.coaching.service;

import com.coaching.dto.QuizRequest;
import com.coaching.dto.QuizSubmitRequest;
import com.coaching.dto.QuizResultResponse;
import com.coaching.entities.*;
import com.coaching.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Map;

@Service
public class QuizService {

    @Autowired private QuizRepository quizRepo;
    @Autowired private QuizSubmissionRepository quizSubmissionRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private ResultService resultService;

    public String createQuiz(QuizRequest req) {
        Optional<Course> course = courseRepo.findById(req.getCourseId());
        if (course.isEmpty()) return "Course not found!";
        
        if (quizRepo.existsByTitleAndCourse_CourseId(req.getTitle(), req.getCourseId()))
            return "Quiz with this title already exists in this course!";

        Quiz quiz = new Quiz();
        quiz.setTitle(req.getTitle());
        quiz.setDescription(req.getDescription());
        quiz.setTotalMarks(req.getTotalMarks());
        quiz.setQuizDate(req.getQuizDate());
        quiz.setDuration(req.getDuration());
        quiz.setPassingScore(req.getPassingScore());
        quiz.setQuestions(req.getQuestions());
        quiz.setCourse(course.get());
        quizRepo.save(quiz);
        return "Quiz created successfully!";
    }

    public List<Quiz> getCourseQuizzes(Integer courseId) {
        return quizRepo.findByCourse_CourseId(courseId);
    }

    public Optional<Quiz> getQuizById(Integer quizId) {
        return quizRepo.findById(quizId);
    }

    public String updateQuiz(Integer quizId, QuizRequest req) {
        Optional<Quiz> opt = quizRepo.findById(quizId);
        if (opt.isEmpty()) return "Quiz not found!";

        Quiz quiz = opt.get();
        quiz.setTitle(req.getTitle());
        quiz.setDescription(req.getDescription());
        quiz.setTotalMarks(req.getTotalMarks());
        quiz.setQuizDate(req.getQuizDate());
        quiz.setDuration(req.getDuration());
        quiz.setPassingScore(req.getPassingScore());
        quiz.setQuestions(req.getQuestions());
        quizRepo.save(quiz);
        return "Quiz updated successfully!";
    }

    public String deleteQuiz(Integer quizId) {
        if (!quizRepo.existsById(quizId)) return "Quiz not found!";
        quizRepo.deleteById(quizId);
        return "Quiz deleted successfully!";
    }

    public QuizResultResponse submitQuiz(QuizSubmitRequest req) {
        Optional<Quiz> quiz = quizRepo.findById(req.getQuizId());
        Optional<Student> student = studentRepo.findById(req.getStudentId());

        if (quiz.isEmpty()) {
            QuizResultResponse error = new QuizResultResponse();
            error.setScore(-1);
            return error;
        }
        if (student.isEmpty()) {
            QuizResultResponse error = new QuizResultResponse();
            error.setScore(-2);
            return error;
        }

        // Check if student is enrolled in the course
        if (!enrollmentRepo.existsByStudent_StudentIdAndCourse_CourseId(req.getStudentId(), quiz.get().getCourse().getCourseId())) {
            QuizResultResponse error = new QuizResultResponse();
            error.setScore(-3);
            return error;
        }

        if (quizSubmissionRepo.existsByQuiz_QuizIdAndStudent_StudentId(req.getQuizId(), req.getStudentId())) {
            QuizResultResponse error = new QuizResultResponse();
            error.setScore(-4);
            return error;
        }

        // Calculate score based on student answers
        ScoreDetails scoreDetails = calculateScoreWithDetails(quiz.get(), req.getAnswers());

        QuizSubmission submission = new QuizSubmission();
        submission.setQuiz(quiz.get());
        submission.setStudent(student.get());
        submission.setScore(scoreDetails.getScore());
        submission.setSubmittedDate(LocalDate.now());
        quizSubmissionRepo.save(submission);

        // Auto-generate or update result for the student
        Integer studentId = student.get().getStudentId();
        Integer courseId = quiz.get().getCourse().getCourseId();

        // Update quiz score in result
        resultService.updateQuizScore(studentId, courseId, scoreDetails.getScore());

        // Build detailed result response
        QuizResultResponse response = new QuizResultResponse();
        response.setSubmissionId(submission.getSubmissionId());
        response.setQuizId(quiz.get().getQuizId());
        response.setQuizTitle(quiz.get().getTitle());
        response.setScore(scoreDetails.getScore());
        response.setTotalMarks(quiz.get().getTotalMarks());
        response.setPassingScore(quiz.get().getPassingScore());
        response.setGrade(calculateGrade(scoreDetails.getScore()));
        response.setSubmittedDate(submission.getSubmittedDate().toString());
        response.setQuestionResults(scoreDetails.getQuestionResults());
        response.setCorrectCount(scoreDetails.getCorrectCount());
        response.setTotalQuestions(scoreDetails.getTotalQuestions());
        response.setPassed(scoreDetails.getScore() >= quiz.get().getPassingScore());

        return response;
    }

    private ScoreDetails calculateScoreWithDetails(Quiz quiz, Map<Integer, Integer> studentAnswers) {
        ScoreDetails details = new ScoreDetails();
        details.setQuestionResults(new ArrayList<>());

        if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            details.setScore(0);
            details.setCorrectCount(0);
            details.setTotalQuestions(0);
            return details;
        }

        // Parse questions from JSON string
        java.util.List<java.util.Map<String, Object>> questions;
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            questions = mapper.readValue(quiz.getQuestions(), java.util.List.class);
        } catch (Exception e) {
            details.setScore(0);
            details.setCorrectCount(0);
            details.setTotalQuestions(0);
            return details;
        }

        int correctCount = 0;
        for (int i = 0; i < questions.size(); i++) {
            java.util.Map<String, Object> question = questions.get(i);
            Integer correctAnswer = (Integer) question.get("correctAnswer");
            Integer studentAnswer = studentAnswers.get(i);
            
            String questionText = (String) question.get("question");
            java.util.List<String> options = (java.util.List<String>) question.get("options");

            QuizResultResponse.QuestionResult qr = new QuizResultResponse.QuestionResult();
            qr.setQuestionIndex(i);
            qr.setQuestion(questionText);
            qr.setOptions(options);
            qr.setCorrectAnswer(correctAnswer);
            qr.setStudentAnswer(studentAnswer);
            
            if (correctAnswer != null && studentAnswer != null && correctAnswer.equals(studentAnswer)) {
                correctCount++;
                qr.setCorrect(true);
            } else {
                qr.setCorrect(false);
            }
            
            // Set answer text for display
            if (correctAnswer != null && options != null && correctAnswer < options.size()) {
                qr.setCorrectAnswerText(options.get(correctAnswer));
            }
            if (studentAnswer != null && options != null && studentAnswer < options.size()) {
                qr.setStudentAnswerText(options.get(studentAnswer));
            }
            
            details.getQuestionResults().add(qr);
        }

        details.setCorrectCount(correctCount);
        details.setTotalQuestions(questions.size());
        details.setScore(questions.size() > 0 ? (correctCount * 100) / questions.size() : 0);
        
        return details;
    }

    private int calculateScore(Quiz quiz, java.util.Map<Integer, Integer> studentAnswers) {
        if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) return 0;

        // Parse questions from JSON string
        java.util.List<java.util.Map<String, Object>> questions;
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            questions = mapper.readValue(quiz.getQuestions(), java.util.List.class);
        } catch (Exception e) {
            return 0;
        }

        int correctCount = 0;
        for (int i = 0; i < questions.size(); i++) {
            java.util.Map<String, Object> question = questions.get(i);
            Integer correctAnswer = (Integer) question.get("correctAnswer");
            Integer studentAnswer = studentAnswers.get(i);

            if (correctAnswer != null && studentAnswer != null && correctAnswer.equals(studentAnswer)) {
                correctCount++;
            }
        }

        return (correctCount * 100) / questions.size();
    }

    // Helper class for score calculation details
    private static class ScoreDetails {
        private int score;
        private int correctCount;
        private int totalQuestions;
        private java.util.List<QuizResultResponse.QuestionResult> questionResults;

        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public int getCorrectCount() { return correctCount; }
        public void setCorrectCount(int correctCount) { this.correctCount = correctCount; }
        public int getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
        public java.util.List<QuizResultResponse.QuestionResult> getQuestionResults() { return questionResults; }
        public void setQuestionResults(java.util.List<QuizResultResponse.QuestionResult> questionResults) { this.questionResults = questionResults; }
    }

    private String calculateGrade(Integer score) {
        if (score == null) return "N/A";

        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        if (score >= 35) return "E";
        return "F";
    }

    public List<QuizSubmission> getQuizSubmissions(Integer quizId) {
        return quizSubmissionRepo.findByQuiz_QuizId(quizId);
    }

    public List<QuizSubmission> getCourseQuizSubmissions(Integer courseId) {
        return quizSubmissionRepo.findByQuiz_Course_CourseId(courseId);
    }

    public boolean hasStudentAttemptedQuiz(Integer quizId, Integer studentId) {
        return quizSubmissionRepo.existsByQuiz_QuizIdAndStudent_StudentId(quizId, studentId);
    }

    public Optional<QuizSubmission> getStudentQuizSubmission(Integer quizId, Integer studentId) {
        List<QuizSubmission> submissions = quizSubmissionRepo.findByQuiz_QuizIdAndStudent_StudentId(quizId, studentId);
        return submissions.isEmpty() ? Optional.empty() : Optional.of(submissions.get(0));
    }
}