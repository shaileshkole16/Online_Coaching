package com.coaching.repository;

import com.coaching.entities.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Integer> {
    
    Optional<UserSettings> findByUser_UserId(Integer userId);
}
