package com.coaching.service;

import com.coaching.dto.SupportTicketRequest;
import com.coaching.dto.SupportTicketResponse;
import com.coaching.entities.SupportTicket;
import com.coaching.entities.SupportTicket.SupportCategory;
import com.coaching.entities.SupportTicket.TicketPriority;
import com.coaching.entities.SupportTicket.TicketStatus;
import com.coaching.repository.SupportTicketRepository;
import com.coaching.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportTicketService {
    
    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;
    
    public SupportTicketResponse createTicket(SupportTicketRequest request) {
        SupportTicket ticket = new SupportTicket();
        ticket.setUser(userRepository.findById(request.getUserId()).orElseThrow());
        ticket.setCategory(SupportCategory.valueOf(request.getCategory()));
        ticket.setPriority(TicketPriority.valueOf(request.getPriority()));
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setAttachmentUrl(request.getAttachmentUrl());
        ticket.setAssignedTo(request.getAssignedTo());
        
        ticket = supportTicketRepository.save(ticket);
        return convertToResponse(ticket);
    }
    
    public SupportTicketResponse updateTicket(Integer ticketId, SupportTicketRequest request) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId).orElseThrow();
        if (request.getCategory() != null) ticket.setCategory(SupportCategory.valueOf(request.getCategory()));
        if (request.getPriority() != null) ticket.setPriority(TicketPriority.valueOf(request.getPriority()));
        if (request.getStatus() != null) ticket.setStatus(TicketStatus.valueOf(request.getStatus()));
        if (request.getSubject() != null) ticket.setSubject(request.getSubject());
        if (request.getDescription() != null) ticket.setDescription(request.getDescription());
        if (request.getAttachmentUrl() != null) ticket.setAttachmentUrl(request.getAttachmentUrl());
        if (request.getAssignedTo() != null) ticket.setAssignedTo(request.getAssignedTo());
        if (request.getResolution() != null) ticket.setResolution(request.getResolution());
        
        ticket = supportTicketRepository.save(ticket);
        return convertToResponse(ticket);
    }
    
    public SupportTicketResponse getTicket(Integer ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId).orElseThrow();
        return convertToResponse(ticket);
    }
    
    public SupportTicketResponse getTicketByNumber(String ticketNumber) {
        SupportTicket ticket = supportTicketRepository.findByTicketNumber(ticketNumber).orElseThrow();
        return convertToResponse(ticket);
    }
    
    public List<SupportTicketResponse> getUserTickets(Integer userId) {
        List<SupportTicket> tickets = supportTicketRepository.findByUser_UserId(userId);
        return tickets.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<SupportTicketResponse> getOpenTickets() {
        List<SupportTicket> tickets = supportTicketRepository.findOpenTickets();
        return tickets.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<SupportTicketResponse> getResolvedTickets() {
        List<SupportTicket> tickets = supportTicketRepository.findResolvedTickets();
        return tickets.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<SupportTicketResponse> getAllTickets() {
        List<SupportTicket> tickets = supportTicketRepository.findAll();
        return tickets.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public void deleteTicket(Integer ticketId) {
        supportTicketRepository.deleteById(ticketId);
    }
    
    private SupportTicketResponse convertToResponse(SupportTicket ticket) {
        SupportTicketResponse response = new SupportTicketResponse();
        response.setId(ticket.getId());
        response.setTicketNumber(ticket.getTicketNumber());
        response.setUserId(ticket.getUser().getUserId());
        response.setUserName(ticket.getUser().getName());
        response.setCategory(ticket.getCategory().name());
        response.setPriority(ticket.getPriority().name());
        response.setStatus(ticket.getStatus().name());
        response.setSubject(ticket.getSubject());
        response.setDescription(ticket.getDescription());
        response.setAttachmentUrl(ticket.getAttachmentUrl());
        response.setAssignedTo(ticket.getAssignedTo());
        if (ticket.getAssignedTo() != null) {
            userRepository.findById(ticket.getAssignedTo()).ifPresent(admin -> {
                response.setAssignedToName(admin.getName());
            });
        }
        response.setResolution(ticket.getResolution());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        response.setResolvedAt(ticket.getResolvedAt());
        return response;
    }
}
