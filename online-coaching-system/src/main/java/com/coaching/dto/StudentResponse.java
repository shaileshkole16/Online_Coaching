package com.coaching.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Integer studentId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String bio;
    private String profilePicture;
    private LocalDate dob;
    private LocalDate joinDate;
}