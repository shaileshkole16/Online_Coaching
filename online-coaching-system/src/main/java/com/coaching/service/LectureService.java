package com.coaching.service;

import com.coaching.dto.LectureRequest;
import com.coaching.entities.Course;
import com.coaching.entities.Lecture;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LectureService {

    @Autowired private LectureRepository lectureRepo;
    @Autowired private CourseRepository courseRepo;

    public String createLecture(LectureRequest req) {
        Optional<Course> course = courseRepo.findById(req.getCourseId());
        if (course.isEmpty()) return "Course not found!";
        
        if (lectureRepo.existsByTitleAndCourse_CourseId(req.getTitle(), req.getCourseId()))
            return "Lecture with this title already exists in this course!";

        Lecture lecture = new Lecture();
        lecture.setTitle(req.getTitle());
        lecture.setDescription(req.getDescription());
        lecture.setVideoUrl(req.getVideoUrl());
        lecture.setLectureOrder(req.getLectureOrder());
        lecture.setUploadDate(req.getUploadDate());
        lecture.setCourse(course.get());
        lectureRepo.save(lecture);
        return "Lecture created successfully!";
    }

    public List<Lecture> getCourseLectures(Integer courseId) {
        try {
            return lectureRepo.findByCourse_CourseId(courseId);
        } catch (Exception e) {
            System.err.println("Error fetching lectures for courseId " + courseId + ": " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public Optional<Lecture> getLectureById(Long lectureId) {
        return lectureRepo.findById(lectureId);
    }

    public String updateLecture(Long lectureId, LectureRequest req) {
        Optional<Lecture> opt = lectureRepo.findById(lectureId);
        if (opt.isEmpty()) return "Lecture not found!";

        Lecture lecture = opt.get();
        lecture.setTitle(req.getTitle());
        lecture.setDescription(req.getDescription());
        lecture.setVideoUrl(req.getVideoUrl());
        lecture.setLectureOrder(req.getLectureOrder());
        lecture.setUploadDate(req.getUploadDate());
        lectureRepo.save(lecture);
        return "Lecture updated successfully!";
    }

    public String deleteLecture(Long lectureId) {
        if (!lectureRepo.existsById(lectureId)) return "Lecture not found!";
        lectureRepo.deleteById(lectureId);
        return "Lecture deleted successfully!";
    }
}