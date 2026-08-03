package com.coaching.controller;

import com.coaching.dto.StudyMaterialResponse;
import com.coaching.entities.StudyMaterial;
import com.coaching.service.StudyMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
public class StudyMaterialController {

    @Autowired private StudyMaterialService materialService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("courseId") Integer courseId) throws IOException {
        return ResponseEntity.ok(materialService.uploadMaterial(file, title, courseId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<StudyMaterialResponse>> getCourseMaterials(@PathVariable Integer courseId) {
        return ResponseEntity.ok(materialService.getCourseMaterials(courseId));
    }

    @GetMapping("/download/{materialId}")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Integer materialId) throws IOException {
        Resource resource = materialService.downloadMaterial(materialId);
        if (resource == null) return ResponseEntity.notFound().build();

        String fileName = materialService.getOriginalFileName(materialId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/delete/{materialId}")
    public ResponseEntity<String> deleteMaterial(@PathVariable Integer materialId) throws IOException {
        return ResponseEntity.ok(materialService.deleteMaterial(materialId));
    }
}
