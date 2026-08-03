package com.coaching.controller;

import com.coaching.dto.CategoryRequest;
import com.coaching.dto.CategoryResponse;
import com.coaching.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @PostMapping("/create")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }
    
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> updateCategory(
        @PathVariable Integer categoryId,
        @RequestBody CategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, request));
    }
    
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> getCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(categoryService.getCategory(categoryId));
    }
    
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    
    @GetMapping("/{parentCategoryId}/subcategories")
    public ResponseEntity<List<CategoryResponse>> getSubCategories(@PathVariable Integer parentCategoryId) {
        return ResponseEntity.ok(categoryService.getSubCategories(parentCategoryId));
    }
    
    @PostMapping("/assign")
    public ResponseEntity<String> assignCourseToCategory(
        @RequestParam Integer courseId,
        @RequestParam Integer categoryId
    ) {
        categoryService.assignCourseToCategory(courseId, categoryId);
        return ResponseEntity.ok("Course assigned to category successfully");
    }
    
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeCourseFromCategory(
        @RequestParam Integer courseId,
        @RequestParam Integer categoryId
    ) {
        categoryService.removeCourseFromCategory(courseId, categoryId);
        return ResponseEntity.ok("Course removed from category successfully");
    }
    
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok("Category deleted successfully");
    }
}
