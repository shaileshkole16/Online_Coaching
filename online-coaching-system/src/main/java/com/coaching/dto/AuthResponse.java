package com.coaching.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String name;
    private String message;
    private Integer userId;
    private UserResponse user;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Integer userId;
        private String name;
        private String email;
        private String role;
        private String phone;
    }
}