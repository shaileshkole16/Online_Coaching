package com.coaching.repository;

import com.coaching.entities.PlatformSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlatformSettingsRepository extends JpaRepository<PlatformSettings, Integer> {
    Optional<PlatformSettings> findFirstByOrderByIdAsc();
}