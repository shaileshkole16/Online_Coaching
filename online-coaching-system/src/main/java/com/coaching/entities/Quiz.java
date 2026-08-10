package com.coaching.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "quiz", uniqueConstraints = @UniqueConstraint(columnNames = {"title", "course_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private Integer quizId;

    private String title;
    private String description;

    @Column(name = "total_marks")
    private int totalMarks;

    @Column(name = "quiz_date")
    private LocalDate quizDate;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "passing_score")
    private Integer passingScore;

    @Column(name = "questions", columnDefinition = "longtext")
    private String questions;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    private Course course;
}