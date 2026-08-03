package com.coaching.repository;

import com.coaching.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUser_Email(String email);
    boolean existsByUser_Email(String email);
    Optional<Student> findByUser_UserId(Integer userId);
}