package com.coaching.repository;

import com.coaching.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
    Optional<Teacher> findByUser_Email(String email);
    boolean existsByUser_Email(String email);
    Optional<Teacher> findByUser_UserId(Integer userId);
}