package com.coaching.controller;

import com.coaching.dto.WishlistRequest;
import com.coaching.dto.WishlistResponse;
import com.coaching.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {
    
    private final WishlistService wishlistService;
    
    @PostMapping("/add")
    public ResponseEntity<WishlistResponse> addToWishlist(@RequestBody WishlistRequest request) {
        return ResponseEntity.ok(wishlistService.addToWishlist(request));
    }
    
    @GetMapping("/{wishlistId}")
    public ResponseEntity<WishlistResponse> getWishlistItem(@PathVariable Integer wishlistId) {
        return ResponseEntity.ok(wishlistService.getWishlistItem(wishlistId));
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<WishlistResponse>> getStudentWishlist(@PathVariable Integer studentId) {
        return ResponseEntity.ok(wishlistService.getStudentWishlist(studentId));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<WishlistResponse>> getCourseWishlist(@PathVariable Integer courseId) {
        return ResponseEntity.ok(wishlistService.getCourseWishlist(courseId));
    }
    
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromWishlist(
        @RequestParam Integer studentId,
        @RequestParam Integer courseId
    ) {
        wishlistService.removeFromWishlist(studentId, courseId);
        return ResponseEntity.ok("Removed from wishlist successfully");
    }
    
    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<String> deleteWishlistItem(@PathVariable Integer wishlistId) {
        wishlistService.deleteWishlistItem(wishlistId);
        return ResponseEntity.ok("Wishlist item deleted successfully");
    }
}
