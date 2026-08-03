package com.coaching.repository;

import com.coaching.entities.Category;
import com.coaching.entities.Category.CategoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    List<Category> findByParentCategory_Id(Integer parentCategoryId);
    
    List<Category> findByStatus(CategoryStatus status);
    
    List<Category> findByStatusOrderByDisplayOrderAsc(CategoryStatus status);
}
