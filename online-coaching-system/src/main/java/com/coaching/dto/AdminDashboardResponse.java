package com.coaching.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private Integer totalStudents;
    private Integer totalTeachers;
    private Integer totalCourses;
    private Integer totalAdmins;
    private BigDecimal totalRevenue;
    private Integer activeUsers;
    private Integer totalEnrollments;
    private List<RecentActivity> recentActivities;
    private String message;

    // Analytics fields
    private Integer activeStudents;
    private Integer activeCourses;
    private Double enrollmentRate;
    private Integer revenueTrend;
    private Integer studentTrend;
    private Integer courseTrend;
    private Integer enrollmentTrend;
    private List<CoursePerformance> coursePerformance;
    private List<TeacherPerformance> teacherPerformance;
    private List<MonthlyStats> monthlyStats;

    public double getAnalyticsTotalRevenue() {
        return totalRevenue != null ? totalRevenue.doubleValue() : 0.0;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String type;
        private String description;
        private String userName;
        private String timestamp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoursePerformance {
        private Integer id;
        private String title;
        private Integer enrollments;
        private Double revenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherPerformance {
        private Integer id;
        private String name;
        private Integer courses;
        private Integer students;
        private Double rating;
        private Double revenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyStats {
        private String month;
        private Integer enrollments;
    }
}
