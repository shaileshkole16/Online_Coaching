import axios from 'axios';

const OLLAMA_BASE_URL = 'http://localhost:11434/api';

export const ollamaAPI = {
  chat: async (messages, model = 'llama3.2', systemPrompt = null) => {
    try {
      const fullMessages = systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;
      
      const response = await axios.post(`${OLLAMA_BASE_URL}/chat`, {
        model: model,
        messages: fullMessages,
        stream: false
      }, {
        timeout: 60000 // 60 second timeout
      });
      return response.data;
    } catch (error) {
      console.error('Ollama Chat Error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error('Failed to connect to Ollama. Make sure Ollama is running on localhost:11434');
    }
  },

  chatStream: async (messages, model = 'llama3.2', systemPrompt = null, onChunk) => {
    try {
      const fullMessages = systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;
      
      const response = await fetch(`${OLLAMA_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: fullMessages,
          stream: true
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              const content = data.message.content;
              fullResponse += content;
              if (onChunk) onChunk(content, fullResponse);
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      return { message: { content: fullResponse } };
    } catch (error) {
      console.error('Ollama Streaming Error:', error);
      throw new Error('Failed to connect to Ollama streaming. Make sure Ollama is running on localhost:11434');
    }
  },

  generate: async (prompt, model = 'llama3.2') => {
    try {
      const response = await axios.post(`${OLLAMA_BASE_URL}/generate`, {
        model: model,
        prompt: prompt,
        stream: false
      });
      return response.data;
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw new Error('Failed to connect to Ollama. Make sure Ollama is running on localhost:11434');
    }
  },

  listModels: async () => {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/tags`);
      return response.data;
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw new Error('Failed to fetch models from Ollama');
    }
  },

  checkHealth: async () => {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/tags`);
      return true;
    } catch (error) {
      return false;
    }
  }
};