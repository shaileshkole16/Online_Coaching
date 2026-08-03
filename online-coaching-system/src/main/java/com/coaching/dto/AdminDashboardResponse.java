package com.coaching.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private Integer totalStudents;
    private Integer totalTeachers;
    private Integer totalCourses;
    private Integer totalAdmins;
    private String message;
}
