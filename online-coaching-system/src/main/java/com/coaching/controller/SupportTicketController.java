package com.coaching.controller;

import com.coaching.dto.SupportTicketRequest;
import com.coaching.dto.SupportTicketResponse;
import com.coaching.service.SupportTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support-tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupportTicketController {
    
    private final SupportTicketService supportTicketService;
    
    @PostMapping("/create")
    public ResponseEntity<SupportTicketResponse> createTicket(@RequestBody SupportTicketRequest request) {
        return ResponseEntity.ok(supportTicketService.createTicket(request));
    }
    
    @PutMapping("/{ticketId}")
    public ResponseEntity<SupportTicketResponse> updateTicket(
        @PathVariable Integer ticketId,
        @RequestBody SupportTicketRequest request
    ) {
        return ResponseEntity.ok(supportTicketService.updateTicket(ticketId, request));
    }
    
    @GetMapping("/{ticketId}")
    public ResponseEntity<SupportTicketResponse> getTicket(@PathVariable Integer ticketId) {
        return ResponseEntity.ok(supportTicketService.getTicket(ticketId));
    }
    
    @GetMapping("/number/{ticketNumber}")
    public ResponseEntity<SupportTicketResponse> getTicketByNumber(@PathVariable String ticketNumber) {
        return ResponseEntity.ok(supportTicketService.getTicketByNumber(ticketNumber));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SupportTicketResponse>> getUserTickets(@PathVariable Integer userId) {
        return ResponseEntity.ok(supportTicketService.getUserTickets(userId));
    }
    
    @GetMapping("/open")
    public ResponseEntity<List<SupportTicketResponse>> getOpenTickets() {
        return ResponseEntity.ok(supportTicketService.getOpenTickets());
    }
    
    @GetMapping("/resolved")
    public ResponseEntity<List<SupportTicketResponse>> getResolvedTickets() {
        return ResponseEntity.ok(supportTicketService.getResolvedTickets());
    }
    
    @GetMapping
    public ResponseEntity<List<SupportTicketResponse>> getAllTickets() {
        return ResponseEntity.ok(supportTicketService.getAllTickets());
    }
    
    @DeleteMapping("/{ticketId}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Integer ticketId) {
        supportTicketService.deleteTicket(ticketId);
        return ResponseEntity.ok().build();
    }
}
