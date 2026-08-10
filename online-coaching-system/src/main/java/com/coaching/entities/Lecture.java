package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "lecture", uniqueConstraints = @UniqueConstraint(columnNames = {"title", "course_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lecture_id")
    private Long lectureId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "lecture_order")
    private int lectureOrder;

    @Column(name = "upload_date")
    private LocalDate uploadDate;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    private Course course;
}