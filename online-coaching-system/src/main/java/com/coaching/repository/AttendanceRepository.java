package com.coaching.repository;

import com.coaching.entities.Attendance;
import com.coaching.entities.Attendance.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    
    Optional<Attendance> findByStudent_StudentIdAndCourse_CourseIdAndAttendanceDate(
        Integer studentId, Integer courseId, LocalDate date
    );
    
    List<Attendance> findByStudent_StudentIdAndAttendanceDateBetween(
        Integer studentId, LocalDate startDate, LocalDate endDate
    );
    
    List<Attendance> findByCourse_CourseIdAndAttendanceDateBetween(
        Integer courseId, LocalDate startDate, LocalDate endDate
    );
    
    List<Attendance> findByStudent_StudentIdAndCourse_CourseId(
        Integer studentId, Integer courseId
    );
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.studentId = :studentId AND a.course.courseId = :courseId AND a.status = 'PRESENT'")
    Long countPresentByStudentAndCourse(@Param("studentId") Integer studentId, @Param("courseId") Integer courseId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.studentId = :studentId AND a.course.courseId = :courseId")
    Long countTotalByStudentAndCourse(@Param("studentId") Integer studentId, @Param("courseId") Integer courseId);
    
    @Query("SELECT a.status, COUNT(a) FROM Attendance a WHERE a.student.studentId = :studentId AND a.course.courseId = :courseId GROUP BY a.status")
    List<Object[]> countByStatusByStudentAndCourse(@Param("studentId") Integer studentId, @Param("courseId") Integer courseId);
    
    @Query("SELECT a FROM Attendance a WHERE a.student.studentId = :studentId AND a.attendanceDate = :date")
    List<Attendance> findByStudentAndDate(@Param("studentId") Integer studentId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Attendance a WHERE a.course.courseId = :courseId AND a.attendanceDate = :date")
    List<Attendance> findByCourseAndDate(@Param("courseId") Integer courseId, @Param("date") LocalDate date);
}
