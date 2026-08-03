package com.coaching.repository;

import com.coaching.entities.SupportTicket;
import com.coaching.entities.SupportTicket.SupportCategory;
import com.coaching.entities.SupportTicket.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Integer> {
    
    Optional<SupportTicket> findByTicketNumber(String ticketNumber);
    
    List<SupportTicket> findByUser_UserId(Integer userId);
    
    List<SupportTicket> findByCategory(SupportCategory category);
    
    List<SupportTicket> findByStatus(TicketStatus status);
    
    List<SupportTicket> findByAssignedTo(Integer adminId);
    
    @Query("SELECT st FROM SupportTicket st WHERE st.status != 'CLOSED' ORDER BY st.createdAt DESC")
    List<SupportTicket> findOpenTickets();
    
    @Query("SELECT st FROM SupportTicket st WHERE st.status = 'RESOLVED' ORDER BY st.resolvedAt DESC")
    List<SupportTicket> findResolvedTickets();
}
