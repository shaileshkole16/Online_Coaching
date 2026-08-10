const API_BASE_URL = 'http://localhost:8080/api';

export const ragService = {
  searchRelevantContent: async (courseId, query) => {
    try {
      console.log('Building RAG context for course:', courseId, 'query:', query);
      
      // Fetch course details, materials, lectures, and assignments
      const [courseRes, materialsRes, lecturesRes, assignmentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/courses/${courseId}`),
        fetch(`${API_BASE_URL}/materials/course/${courseId}`),
        fetch(`${API_BASE_URL}/lectures/course/${courseId}`),
        fetch(`${API_BASE_URL}/assignments/course/${courseId}`)
      ]);

      const course = courseRes.ok ? await courseRes.json() : null;
      const materials = materialsRes.ok ? await materialsRes.json() : [];
      const lectures = lecturesRes.ok ? await lecturesRes.json() : [];
      const assignments = assignmentsRes.ok ? await assignmentsRes.json() : [];

      console.log('RAG data received:', { course, materialsCount: materials?.length, lecturesCount: lectures?.length, assignmentsCount: assignments?.length });

      const context = buildRAGContext(course, materials, lectures, assignments, query);
      console.log('Final RAG context built, length:', context.length);
      return context;
    } catch (error) {
      console.error('RAG search error:', error);
      return null;
    }
  }
};

const buildRAGContext = (course, materials, lectures, assignments, query) => {
  try {
    let context = '';
    
    // Add course information
    if (course) {
      context += `Course Content Context:\n\n`;
      context += `Course: ${course.title || course.name || 'Unknown Course'}\n`;
      context += `Description: ${course.description || 'No description'}\n`;
      context += `Level: ${course.level || 'Not specified'}\n`;
      context += `Duration: ${course.duration || 'Not specified'}\n\n`;
    }

    // Add study materials
    if (materials && materials.length > 0) {
      context += `Study Materials:\n\n`;
      materials.forEach((material, index) => {
        context += `${index + 1}. ${material.title || 'Untitled Material'}\n`;
        if (material.description) {
          context += `Description: ${material.description}\n`;
        }
        if (material.uploadDate) {
          context += `Uploaded: ${material.uploadDate}\n`;
        }
        context += '\n';
      });
    }

    // Add lectures
    if (lectures && lectures.length > 0) {
      context += `Lectures:\n\n`;
      lectures.forEach((lecture, index) => {
        context += `${index + 1}. ${lecture.title || 'Untitled Lecture'}\n`;
        if (lecture.description) {
          context += `Description: ${lecture.description}\n`;
        }
        if (lecture.videoUrl) {
          context += `Video: ${lecture.videoUrl}\n`;
        }
        if (lecture.uploadDate) {
          context += `Uploaded: ${lecture.uploadDate}\n`;
        }
        context += '\n';
      });
    }

    // Add assignments
    if (assignments && assignments.length > 0) {
      context += `Assignments:\n\n`;
      assignments.forEach((assignment, index) => {
        context += `${index + 1}. ${assignment.title || 'Untitled Assignment'}\n`;
        if (assignment.description) {
          context += `Description: ${assignment.description}\n`;
        }
        if (assignment.totalMarks) {
          context += `Total Marks: ${assignment.totalMarks}\n`;
        }
        if (assignment.deadline) {
          context += `Deadline: ${assignment.deadline}\n`;
        }
        if (assignment.createdDate) {
          context += `Created: ${assignment.createdDate}\n`;
        }
        context += '\n';
      });
    }

    // If no content was found, provide a helpful message
    if (!materials?.length && !lectures?.length && !assignments?.length) {
      context += 'Note: No detailed course materials, lectures, or assignments are currently available for this course. The AI will provide general assistance based on the course topic and your questions.\n';
    }

    console.log('Final RAG context built, length:', context.length);
    console.log('Context preview:', context.substring(0, 200) + '...');
    return context;
  } catch (error) {
    console.error('Error building RAG context:', error);
    return 'Note: Unable to load course materials at this time. The AI will provide general assistance based on your questions.';
  }
};