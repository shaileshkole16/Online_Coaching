package com.coaching.service;

import com.coaching.dto.CategoryRequest;
import com.coaching.dto.CategoryResponse;
import com.coaching.entities.Category;
import com.coaching.entities.Category.CategoryStatus;
import com.coaching.entities.CourseCategory;
import com.coaching.repository.CategoryRepository;
import com.coaching.repository.CourseCategoryRepository;
import com.coaching.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final CourseCategoryRepository courseCategoryRepository;
    private final CourseRepository courseRepository;
    
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        if (request.getParentCategoryId() != null) {
            category.setParentCategory(categoryRepository.findById(request.getParentCategoryId()).orElse(null));
        }
        category.setStatus(CategoryStatus.valueOf(request.getStatus()));
        category.setDisplayOrder(request.getDisplayOrder());
        
        category = categoryRepository.save(category);
        return convertToResponse(category);
    }
    
    public CategoryResponse updateCategory(Integer categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        if (request.getParentCategoryId() != null) {
            category.setParentCategory(categoryRepository.findById(request.getParentCategoryId()).orElse(null));
        }
        category.setStatus(CategoryStatus.valueOf(request.getStatus()));
        category.setDisplayOrder(request.getDisplayOrder());
        
        category = categoryRepository.save(category);
        return convertToResponse(category);
    }
    
    public CategoryResponse getCategory(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        return convertToResponse(category);
    }
    
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findByStatusOrderByDisplayOrderAsc(CategoryStatus.ACTIVE);
        return categories.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<CategoryResponse> getSubCategories(Integer parentCategoryId) {
        List<Category> categories = categoryRepository.findByParentCategory_Id(parentCategoryId);
        return categories.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public void assignCourseToCategory(Integer courseId, Integer categoryId) {
        CourseCategory courseCategory = new CourseCategory();
        courseCategory.setCourse(courseRepository.findById(courseId).orElseThrow());
        courseCategory.setCategory(categoryRepository.findById(categoryId).orElseThrow());
        courseCategoryRepository.save(courseCategory);
    }
    
    public void removeCourseFromCategory(Integer courseId, Integer categoryId) {
        CourseCategory courseCategory = courseCategoryRepository
            .findByCourse_CourseId(courseId)
            .stream()
            .filter(cc -> cc.getCategory().getId().equals(categoryId))
            .findFirst()
            .orElseThrow();
        courseCategoryRepository.delete(courseCategory);
    }
    
    public void deleteCategory(Integer categoryId) {
        categoryRepository.deleteById(categoryId);
    }
    
    private CategoryResponse convertToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setIcon(category.getIcon());
        if (category.getParentCategory() != null) {
            response.setParentCategoryId(category.getParentCategory().getId());
            response.setParentCategoryName(category.getParentCategory().getName());
        }
        response.setStatus(category.getStatus().name());
        response.setDisplayOrder(category.getDisplayOrder());
        response.setCreatedAt(category.getCreatedAt().toString());
        response.setUpdatedAt(category.getUpdatedAt().toString());
        
        List<CourseCategory> courseCategories = courseCategoryRepository.findByCategory_Id(category.getId());
        response.setCourseCount(courseCategories.size());
        
        return response;
    }
}
