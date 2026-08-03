package com.coaching.service;

import com.coaching.entities.Course;
import com.coaching.entities.Enrollment;
import com.coaching.entities.Student;
import com.coaching.entities.User;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.EnrollmentRepository;
import com.coaching.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepo;

    @Mock
    private StudentRepository studentRepo;

    @Mock
    private CourseRepository courseRepo;

    @InjectMocks
    private EnrollmentService enrollmentService;

    @Test
    void enrollStudent_shouldResolveStudentByUserId_whenFrontendPassesUserId() {
        Integer userId = 10;
        Integer courseId = 20;

        User user = new User();
        user.setUserId(userId);

        Student student = new Student();
        student.setStudentId(99);
        student.setUser(user);

        Course course = new Course();
        course.setCourseId(courseId);

        when(studentRepo.findById(userId)).thenReturn(Optional.empty());
        when(studentRepo.findByUser_UserId(userId)).thenReturn(Optional.of(student));
        when(courseRepo.findById(courseId)).thenReturn(Optional.of(course));
        when(enrollmentRepo.existsByStudent_StudentIdAndCourse_CourseId(99, courseId)).thenReturn(false);
        when(enrollmentRepo.save(any(Enrollment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = enrollmentService.enrollStudent(userId, courseId);

        assertTrue(result.contains("Student enrolled successfully"));
        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepo).save(captor.capture());
        assertEquals(99, captor.getValue().getStudent().getStudentId());
        assertEquals(courseId, captor.getValue().getCourse().getCourseId());
    }
}
