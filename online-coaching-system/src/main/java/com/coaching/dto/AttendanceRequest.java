package com.coaching.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AttendanceRequest {
    private Integer studentId;
    private Integer courseId;
    private LocalDate attendanceDate;
    private String status; // PRESENT, ABSENT, LATE, EXCUSED
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private String notes;
}
