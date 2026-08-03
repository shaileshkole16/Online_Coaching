package com.coaching.controller;



import com.coaching.dto.UserSettingsRequest;
import com.coaching.dto.UserSettingsResponse;
import com.coaching.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user-settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserSettingsController {
    
    private final UserSettingsService userSettingsService;
    
    @PostMapping("/create")
    public ResponseEntity<UserSettingsResponse> createSettings(@RequestBody UserSettingsRequest request) {
        return ResponseEntity.ok(userSettingsService.createSettings(request));
    }
    
    @PutMapping("/{settingsId}")
    public ResponseEntity<UserSettingsResponse> updateSettings(
        @PathVariable Integer settingsId,
        @RequestBody UserSettingsRequest request
    ) {
        return ResponseEntity.ok(userSettingsService.updateSettings(settingsId, request));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserSettingsResponse> getUserSettings(@PathVariable Integer userId) {
        return ResponseEntity.ok(userSettingsService.getUserSettings(userId));
    }
    
    @DeleteMapping("/{settingsId}")
    public ResponseEntity<Void> deleteSettings(@PathVariable Integer settingsId) {
        userSettingsService.deleteSettings(settingsId);
        return ResponseEntity.ok().build();
    }
}
