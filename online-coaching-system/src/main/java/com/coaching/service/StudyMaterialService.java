package com.coaching.service;

import com.coaching.dto.StudyMaterialResponse;
import com.coaching.entities.Course;
import com.coaching.entities.StudyMaterial;
import com.coaching.repository.CourseRepository;
import com.coaching.repository.StudyMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudyMaterialService {

    @Autowired private StudyMaterialRepository materialRepo;
    @Autowired private CourseRepository courseRepo;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String uploadMaterial(MultipartFile file, String title  , Integer courseId) throws IOException {
        if (file == null || file.isEmpty()) return "File is required!";
        Optional<Course> course = courseRepo.findById(courseId);
        if (course.isEmpty()) return "Course not found!";
        
        if (materialRepo.existsByTitleAndCourse_CourseId(title, courseId))
            return "Study material with this title already exists in this course!";

        Path materialsDir = Paths.get(uploadDir, "materials");
        Files.createDirectories(materialsDir);

        String storedName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path targetPath = materialsDir.resolve(storedName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        StudyMaterial material = new StudyMaterial();
        material.setTitle(title);
        material.setFileUrl("materials/" + storedName);
        material.setUploadDate(LocalDate.now());
        material.setCourse(course.get());
        materialRepo.save(material);

        return "Material uploaded successfully! Material ID: " + material.getMaterialId();
    }

    public List<StudyMaterialResponse> getCourseMaterials(Integer courseId) {
        return materialRepo.findByCourse_CourseId(courseId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private StudyMaterialResponse convertToResponse(StudyMaterial material) {
        StudyMaterialResponse response = new StudyMaterialResponse();
        response.setId(material.getMaterialId());
        response.setTitle(material.getTitle());
        // Extract filename from fileUrl (e.g., "materials/uuid_filename.pdf" -> "uuid_filename.pdf")
        String fileUrl = material.getFileUrl();
        if (fileUrl != null && fileUrl.contains("/")) {
            response.setFileName(fileUrl.substring(fileUrl.lastIndexOf("/") + 1));
        } else {
            response.setFileName(fileUrl);
        }
        response.setUploadDate(material.getUploadDate());
        if (material.getCourse() != null) {
            response.setCourseId(material.getCourse().getCourseId());
        }
        return response;
    }

    public Resource downloadMaterial(Integer materialId) throws MalformedURLException {
        Optional<StudyMaterial> opt = materialRepo.findById(materialId);
        if (opt.isEmpty()) return null;

        Path filePath = Paths.get(uploadDir).resolve(opt.get().getFileUrl()).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) return null;
        return resource;
    }

    public String getOriginalFileName(Integer materialId) {
        return materialRepo.findById(materialId)
                .map(m -> Paths.get(m.getFileUrl()).getFileName().toString())
                .orElse("material");
    }

    public String deleteMaterial(Integer materialId) throws IOException {
        Optional<StudyMaterial> opt = materialRepo.findById(materialId);
        if (opt.isEmpty()) return "Material not found!";

        Path filePath = Paths.get(uploadDir).resolve(opt.get().getFileUrl()).normalize();
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        materialRepo.deleteById(materialId);
        return "Material deleted successfully!";
    }
}
