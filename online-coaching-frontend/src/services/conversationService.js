const API_BASE_URL = 'http://localhost:8080/api';

export const conversationService = {
  saveConversation: async (conversation) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversation)
      });
      if (!response.ok) {
        console.error('Failed to save conversation to backend:', response.status);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving conversation:', error);
      return null;
    }
  },

  getConversations: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-conversations/user/${userId}`);
      if (!response.ok) {
        console.error('Failed to fetch conversations:', response.status);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  updateConversation: async (conversationId, conversation) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversation)
      });
      if (!response.ok) {
        console.error('Failed to update conversation:', response.status);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating conversation:', error);
      return null;
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-conversations/${conversationId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        console.error('Failed to delete conversation:', response.status);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }
};