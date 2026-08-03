package com.coaching.service;

import com.coaching.dto.AttendanceRequest;
import com.coaching.dto.AttendanceResponse;
import com.coaching.entities.Attendance;
import com.coaching.entities.Attendance.AttendanceStatus;
import com.coaching.repository.AttendanceRepository;
import com.coaching.repository.StudentRepository;
import com.coaching.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        Attendance attendance = new Attendance();
        attendance.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
        attendance.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow());
        attendance.setAttendanceDate(request.getAttendanceDate() != null ? request.getAttendanceDate() : LocalDate.now());
        attendance.setStatus(AttendanceStatus.valueOf(request.getStatus()));
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setNotes(request.getNotes());
        
        attendance = attendanceRepository.save(attendance);
        return convertToResponse(attendance);
    }
    
    public AttendanceResponse updateAttendance(Integer attendanceId, AttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(attendanceId).orElseThrow();
        attendance.setStatus(AttendanceStatus.valueOf(request.getStatus()));
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setNotes(request.getNotes());
        
        attendance = attendanceRepository.save(attendance);
        return convertToResponse(attendance);
    }
    
    public AttendanceResponse getAttendance(Integer attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId).orElseThrow();
        return convertToResponse(attendance);
    }
    
    public List<AttendanceResponse> getStudentAttendance(Integer studentId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByStudent_StudentIdAndAttendanceDateBetween(
            studentId, startDate, endDate
        );
        return attendances.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AttendanceResponse> getCourseAttendance(Integer courseId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByCourse_CourseIdAndAttendanceDateBetween(
            courseId, startDate, endDate
        );
        return attendances.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<AttendanceResponse> getStudentCourseAttendance(Integer studentId, Integer courseId) {
        List<Attendance> attendances = attendanceRepository.findByStudent_StudentIdAndCourse_CourseId(
            studentId, courseId
        );
        Long presentCount = attendanceRepository.countPresentByStudentAndCourse(studentId, courseId);
        Long totalCount = attendanceRepository.countTotalByStudentAndCourse(studentId, courseId);
        
        Double percentage = totalCount > 0 ? (presentCount.doubleValue() / totalCount.doubleValue()) * 100 : 0.0;
        
        return attendances.stream()
            .map(this::convertToResponse)
            .peek(response -> response.setAttendancePercentage(percentage))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void markBulkAttendance(List<AttendanceRequest> requests) {
        for (AttendanceRequest request : requests) {
            Attendance attendance = new Attendance();
            attendance.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
            attendance.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow());
            attendance.setAttendanceDate(request.getAttendanceDate() != null ? request.getAttendanceDate() : LocalDate.now());
            attendance.setStatus(AttendanceStatus.valueOf(request.getStatus()));
            attendance.setCheckInTime(request.getCheckInTime());
            attendance.setCheckOutTime(request.getCheckOutTime());
            attendance.setNotes(request.getNotes());
            attendanceRepository.save(attendance);
        }
    }
    
    public void deleteAttendance(Integer attendanceId) {
        attendanceRepository.deleteById(attendanceId);
    }
    
    private AttendanceResponse convertToResponse(Attendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        response.setStudentId(attendance.getStudent().getStudentId());
        response.setStudentName(attendance.getStudent().getUser().getName());
        response.setCourseId(attendance.getCourse().getCourseId());
        response.setCourseName(attendance.getCourse().getTitle());
        response.setAttendanceDate(attendance.getAttendanceDate());
        response.setStatus(attendance.getStatus().name());
        response.setCheckInTime(attendance.getCheckInTime());
        response.setCheckOutTime(attendance.getCheckOutTime());
        response.setNotes(attendance.getNotes());
        response.setMarkedBy(attendance.getMarkedBy() != null ? attendance.getMarkedBy().getName() : null);
        response.setCreatedAt(attendance.getCreatedAt().toString());
        return response;
    }
}
