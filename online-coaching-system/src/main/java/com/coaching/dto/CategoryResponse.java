package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CategoryResponse {
    private Integer id;
    private String name;
    private String description;
    private String icon;
    private Integer parentCategoryId;
    private String parentCategoryName;
    private String status;
    private Integer displayOrder;
    private Integer courseCount;
    private String createdAt;
    private String updatedAt;
}
