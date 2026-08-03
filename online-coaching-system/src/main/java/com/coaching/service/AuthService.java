package com.coaching.service;

import com.coaching.dto.*;
import com.coaching.entities.*;
import com.coaching.repository.*;
import com.coaching.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private TeacherRepository teacherRepo;
    @Autowired private AdminRepository adminRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordResetTokenRepository resetTokenRepo;

    public AuthResponse registerStudent(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            return new AuthResponse(null, null, null, "Email already exists!", null, null);

        // Create User first
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("STUDENT");
        user = userRepo.save(user);

        // Create Student with User reference
        Student student = new Student();
        student.setUser(user);
        student.setPhone(req.getPhone());
        student.setAddress(req.getAddress());
        student.setJoinDate(LocalDate.now());
        studentRepo.save(student);

        String token = jwtUtil.generateToken(req.getEmail(), "STUDENT");
        
        AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
            user.getUserId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            student.getPhone()
        );
        
        return new AuthResponse(token, "STUDENT", req.getName(), "Student registered successfully!", user.getUserId(), userResponse);
    }

    public AuthResponse registerTeacher(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            return new AuthResponse(null, null, null, "Email already exists!", null, null);

        // Create User first
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("TEACHER");
        user = userRepo.save(user);

        // Create Teacher with User reference
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setPhone(req.getPhone());
        teacher.setQualification(req.getQualification());
        teacher.setExpertise(req.getExpertise());
        teacher.setJoinDate(LocalDate.now());
        teacherRepo.save(teacher);

        String token = jwtUtil.generateToken(req.getEmail(), "TEACHER");
        
        AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
            user.getUserId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            teacher.getPhone()
        );
        
        return new AuthResponse(token, "TEACHER", req.getName(), "Teacher registered successfully!", user.getUserId(), userResponse);
    }

    public AuthResponse registerAdmin(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            return new AuthResponse(null, null, null, "Email already exists!", null, null);

        // Create User first
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("ADMIN");
        user = userRepo.save(user);

        // Create Admin with User reference
        Admin admin = new Admin();
        admin.setUser(user);
        admin.setPhone(req.getPhone());
        adminRepo.save(admin);

        String token = jwtUtil.generateToken(req.getEmail(), "ADMIN");
        
        AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
            user.getUserId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            admin.getPhone()
        );
        
        return new AuthResponse(token, "ADMIN", req.getName(), "Admin registered successfully!", user.getUserId(), userResponse);
    }

    public AuthResponse login(LoginRequest req) {
        String requestedRole = req.getUserType();
        
        // If userType is specified, validate the role
        if (requestedRole != null && !requestedRole.isEmpty()) {
            requestedRole = requestedRole.toUpperCase();
            
            if (requestedRole.equals("STUDENT")) {
                var student = studentRepo.findByUser_Email(req.getEmail());
                if (student.isPresent()) {
                    if (passwordEncoder.matches(req.getPassword(), student.get().getUser().getPassword())) {
                        String token = jwtUtil.generateToken(req.getEmail(), "STUDENT");
                        AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                            student.get().getUser().getUserId(),
                            student.get().getUser().getName(),
                            student.get().getUser().getEmail(),
                            student.get().getUser().getRole(),
                            student.get().getPhone()
                        );
                        return new AuthResponse(token, "STUDENT", student.get().getUser().getName(), "Login successful!", student.get().getUser().getUserId(), userResponse);
                    }
                    return new AuthResponse(null, null, null, "Wrong password!", null, null);
                }
                return new AuthResponse(null, null, null, "Student not found with this email!", null, null);
            }
            
            if (requestedRole.equals("TEACHER")) {
                var teacher = teacherRepo.findByUser_Email(req.getEmail());
                if (teacher.isPresent()) {
                    if (passwordEncoder.matches(req.getPassword(), teacher.get().getUser().getPassword())) {
                        String token = jwtUtil.generateToken(req.getEmail(), "TEACHER");
                        AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                            teacher.get().getUser().getUserId(),
                            teacher.get().getUser().getName(),
                            teacher.get().getUser().getEmail(),
                            teacher.get().getUser().getRole(),
                            teacher.get().getPhone()
                        );
                        return new AuthResponse(token, "TEACHER", teacher.get().getUser().getName(), "Login successful!", teacher.get().getUser().getUserId(), userResponse);
                    }
                    return new AuthResponse(null, null, null, "Wrong password!", null, null);
                }
                return new AuthResponse(null, null, null, "Teacher not found with this email!", null, null);
            }
            
            if (requestedRole.equals("ADMIN")) {
                var admin = adminRepo.findByUser_Email(req.getEmail());
                if (admin.isPresent()) {
                    if (passwordEncoder.matches(req.getPassword(), admin.get().getUser().getPassword())) {
                        String token = jwtUtil.generateToken(req.getEmail(), "ADMIN");
                        AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                            admin.get().getUser().getUserId(),
                            admin.get().getUser().getName(),
                            admin.get().getUser().getEmail(),
                            admin.get().getUser().getRole(),
                            null
                        );
                        return new AuthResponse(token, "ADMIN", admin.get().getUser().getName(), "Login successful!", admin.get().getUser().getUserId(), userResponse);
                    }
                    return new AuthResponse(null, null, null, "Wrong password!", null, null);
                }
                return new AuthResponse(null, null, null, "Admin not found with this email!", null, null);
            }
        }
        
        // Fallback to original logic if no userType specified
        var student = studentRepo.findByUser_Email(req.getEmail());
        if (student.isPresent()) {
            if (passwordEncoder.matches(req.getPassword(), student.get().getUser().getPassword())) {
                String token = jwtUtil.generateToken(req.getEmail(), "STUDENT");
                AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                    student.get().getUser().getUserId(),
                    student.get().getUser().getName(),
                    student.get().getUser().getEmail(),
                    student.get().getUser().getRole(),
                    student.get().getPhone()
                );
                return new AuthResponse(token, "STUDENT", student.get().getUser().getName(), "Login successful!", student.get().getUser().getUserId(), userResponse);
            }
            return new AuthResponse(null, null, null, "Wrong password!", null, null);
        }

        var teacher = teacherRepo.findByUser_Email(req.getEmail());
        if (teacher.isPresent()) {
            if (passwordEncoder.matches(req.getPassword(), teacher.get().getUser().getPassword())) {
                String token = jwtUtil.generateToken(req.getEmail(), "TEACHER");
                AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                    teacher.get().getUser().getUserId(),
                    teacher.get().getUser().getName(),
                    teacher.get().getUser().getEmail(),
                    teacher.get().getUser().getRole(),
                    teacher.get().getPhone()
                );
                return new AuthResponse(token, "TEACHER", teacher.get().getUser().getName(), "Login successful!", teacher.get().getUser().getUserId(), userResponse);
            }
            return new AuthResponse(null, null, null, "Wrong password!", null, null);
        }

        var admin = adminRepo.findByUser_Email(req.getEmail());
        if (admin.isPresent()) {
            if (passwordEncoder.matches(req.getPassword(), admin.get().getUser().getPassword())) {
                String token = jwtUtil.generateToken(req.getEmail(), "ADMIN");
                AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                    admin.get().getUser().getUserId(),
                    admin.get().getUser().getName(),
                    admin.get().getUser().getEmail(),
                    admin.get().getUser().getRole(),
                    null
                );
                return new AuthResponse(token, "ADMIN", admin.get().getUser().getName(), "Login successful!", admin.get().getUser().getUserId(), userResponse);
            }
            return new AuthResponse(null, null, null, "Wrong password!", null, null);
        }

        return new AuthResponse(null, null, null, "User not found!", null, null);
    }

    public AuthResponse logout() {
        return new AuthResponse(null, null, null, "Logged out successfully!", null, null);
    }

    private User ensureUser(String name, String email, String role) {
        return userRepo.findByEmail(email).map(existing -> {
            existing.setName(name);
            existing.setRole(role);
            return userRepo.save(existing);
        }).orElseGet(() -> {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setRole(role);
            return userRepo.save(user);
        });
    }
    
    
    
    
    
    
    
    

    // ✅ FORGOT PASSWORD
//    public AuthResponse forgotPassword(ForgotPasswordRequest req) {
//        String email = req.getEmail();
//
//        boolean exists = studentRepo.existsByEmail(email) || teacherRepo.existsByEmail(email)
//                || adminRepo.findByEmail(email).isPresent();
//
//        if (!exists)
//            return new AuthResponse(null, null, null, "Email not registered!");
//
//        // Delete old tokens for this email
//        resetTokenRepo.deleteByEmail(email);
//
//        // Generate 6-digit OTP
//        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
//
//        PasswordResetToken resetToken = new PasswordResetToken();
//        resetToken.setEmail(email);
//        resetToken.setOtp(otp);
//        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(10));
//        resetToken.setUsed(false);
//        resetTokenRepo.save(resetToken);
//
//        // ⚠️ In real project: send OTP via email (use JavaMailSender)
//        // For now, returning OTP in response for testing
//        return new AuthResponse(null, null, null, "OTP sent! (Test OTP: " + otp + ")");
//    }
    
    @Transactional  // ✅ ADD THIS
    public AuthResponse forgotPassword(ForgotPasswordRequest req) {
        String email = req.getEmail();

        boolean exists = studentRepo.existsByUser_Email(email) || teacherRepo.existsByUser_Email(email)
                || adminRepo.findByUser_Email(email).isPresent();

        if (!exists)
            return new AuthResponse(null, null, null, "Email not registered!", null, null);

        // Delete old tokens for this email
        resetTokenRepo.deleteByEmail(email);

        // Generate 6-digit OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setOtp(otp);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        resetToken.setUsed(false);
        resetTokenRepo.save(resetToken);

        return new AuthResponse(null, null, null, "OTP sent! (Test OTP: " + otp + ")", null, null);
    }

    // ✅ RESET PASSWORD
    public AuthResponse resetPassword(ResetPasswordRequest req) {
        var tokenOpt = resetTokenRepo.findByEmailAndOtpAndUsedFalse(req.getEmail(), req.getOtp());

        if (tokenOpt.isEmpty())
            return new AuthResponse(null, null, null, "Invalid OTP!", null, null);

        PasswordResetToken token = tokenOpt.get();
        if (token.getExpiryTime().isBefore(LocalDateTime.now()))
            return new AuthResponse(null, null, null, "OTP expired! Request a new one.", null, null);

        String encodedPassword = passwordEncoder.encode(req.getNewPassword());

        // Update password in User table
        var user = userRepo.findByEmail(req.getEmail());
        if (user.isPresent()) {
            user.get().setPassword(encodedPassword);
            userRepo.save(user.get());
        }

        // Mark token as used
        token.setUsed(true);
        resetTokenRepo.save(token);

        return new AuthResponse(null, null, null, "Password reset successfully!", null, null);
    }
}