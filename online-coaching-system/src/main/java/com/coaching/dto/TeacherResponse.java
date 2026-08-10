package com.coaching.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherResponse {
    private Integer teacherId;
    private String name;
    private String email;
    private String phone;
    private String qualification;
    private String expertise;
    private String bio;
    private String profilePicture;
    private LocalDate joinDate;
    private List<String> achievements;
}