package com.coaching.repository;

import com.coaching.entities.DiscussionForum;
import com.coaching.entities.DiscussionForum.ForumStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscussionForumRepository extends JpaRepository<DiscussionForum, Integer> {
    
    List<DiscussionForum> findByCourse_CourseId(Integer courseId);
    
    List<DiscussionForum> findByStudent_StudentId(Integer studentId);
    
    List<DiscussionForum> findByTeacher_TeacherId(Integer teacherId);
    
    List<DiscussionForum> findByStatus(ForumStatus status);
    
    List<DiscussionForum> findByIsPinnedTrue();
    
    @Query("SELECT df FROM DiscussionForum df WHERE df.course.courseId = :courseId AND df.status = 'OPEN' ORDER BY df.isPinned DESC, df.createdAt DESC")
    List<DiscussionForum> findOpenByCourse(@Param("courseId") Integer courseId);
    
    @Query("SELECT df FROM DiscussionForum df WHERE df.category = :category ORDER BY df.createdAt DESC")
    List<DiscussionForum> findByCategory(@Param("category") String category);
}
