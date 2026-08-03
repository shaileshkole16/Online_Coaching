package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "course", uniqueConstraints = @UniqueConstraint(columnNames = {"title", "teacher_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")       // ✅ matches DB
    private Integer courseId;

    private String title;

    @Column(length = 2000)
    private String description;

    private String duration;
    private String level;
    private BigDecimal price;

    @Column(name = "created_date")    // ✅ matches DB
    private LocalDate createdDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id")  // ✅ matches DB
    private Teacher teacher;
}