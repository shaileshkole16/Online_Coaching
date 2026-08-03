package com.coaching.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private static final String PROFILE_UPLOAD_DIR = "uploads/profiles/";
    private static final String VIDEO_UPLOAD_DIR = "uploads/videos/";
    private static final String ASSIGNMENT_UPLOAD_DIR = "uploads/assignments/";
    private static final String BASE_URL = "http://localhost:8080";
    private static final long MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
    private static final long MAX_ASSIGNMENT_SIZE = 50 * 1024 * 1024; // 50MB

    @PostMapping("/profile")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(PROFILE_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return file URL
            String fileUrl = BASE_URL + "/" + PROFILE_UPLOAD_DIR + filename;
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", filename);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    @PostMapping("/video")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file size
            if (file.getSize() > MAX_VIDEO_SIZE) {
                return ResponseEntity.badRequest().body("File size exceeds 500MB limit");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("video/")) {
                return ResponseEntity.badRequest().body("Only video files are allowed");
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(VIDEO_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return file URL
            String fileUrl = BASE_URL + "/" + VIDEO_UPLOAD_DIR + filename;
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", filename);
            response.put("size", String.valueOf(file.getSize()));
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload video: " + e.getMessage());
        }
    }

    @PostMapping("/assignment")
    public ResponseEntity<?> uploadAssignment(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file size
            if (file.getSize() > MAX_ASSIGNMENT_SIZE) {
                return ResponseEntity.badRequest().body("File size exceeds 50MB limit");
            }

            // Validate file type (allow common document types)
            String contentType = file.getContentType();
            if (contentType == null || 
                (!contentType.startsWith("application/pdf") && 
                 !contentType.startsWith("application/msword") && 
                 !contentType.startsWith("application/vnd.openxmlformats") &&
                 !contentType.startsWith("application/zip") &&
                 !contentType.startsWith("image/"))) {
                return ResponseEntity.badRequest().body("Only PDF, Word, ZIP, and image files are allowed");
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(ASSIGNMENT_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return file URL
            String fileUrl = BASE_URL + "/" + ASSIGNMENT_UPLOAD_DIR + filename;
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", filename);
            response.put("size", String.valueOf(file.getSize()));
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload assignment: " + e.getMessage());
        }
    }
}
