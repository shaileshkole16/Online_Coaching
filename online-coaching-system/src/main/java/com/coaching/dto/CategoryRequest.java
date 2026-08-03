package com.coaching.dto;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private String description;
    private String icon;
    private Integer parentCategoryId;
    private String status; // ACTIVE, INACTIVE
    private Integer displayOrder;
}
