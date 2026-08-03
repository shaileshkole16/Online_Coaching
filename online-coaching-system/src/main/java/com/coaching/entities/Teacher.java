package com.coaching.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "teacher")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer teacherId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private User user;

    private String phone;
    private String qualification;
    private String expertise;
    private String bio;

    @Column(name = "profile_picture")
    private String profilePicture;

    private LocalDate joinDate;
    
    @ElementCollection
    @CollectionTable(name = "teacher_achievements", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "achievement")
    private List<String> achievements;
}