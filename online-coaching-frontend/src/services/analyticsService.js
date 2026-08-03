import { analyticsAPI } from './api';

class AnalyticsService {
  constructor() {
    this.events = [];
    this.sessionStartTime = null;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async initialize() {
    this.sessionStartTime = new Date();
    await this.trackEvent('app_opened', {
      timestamp: this.sessionStartTime.toISOString(),
    });
  }

  async trackEvent(eventName, properties = {}) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const event = {
      eventName,
      properties: JSON.stringify(properties),
      sessionId: this.sessionId,
      userId: user.id || null,
      userRole: user.role || null,
      deviceInfo: this.getDeviceInfo(),
      appVersion: '1.0.0',
      platform: 'web',
      ipAddress: null, // Would be filled by backend
      userAgent: navigator.userAgent,
    };

    try {
      await analyticsAPI.trackEvent(event);
      console.log('Analytics Event tracked:', eventName);
    } catch (error) {
      console.log('Error tracking event:', error);
      // Store locally for retry
      this.events.push(event);
    }
  }

  async trackPageView(pageName, properties = {}) {
    await this.trackEvent('page_view', {
      pageName,
      ...properties,
    });
  }

  async trackUserAction(actionName, properties = {}) {
    await this.trackEvent('user_action', {
      actionName,
      ...properties,
    });
  }

  async trackError(error, context = {}) {
    await this.trackEvent('error', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context,
    });
  }

  async trackCourseEnrollment(courseId, courseName, price) {
    await this.trackEvent('course_enrollment', {
      courseId,
      courseName,
      price,
    });
  }

  async trackPayment(amount, paymentMethod, status) {
    await this.trackEvent('payment', {
      amount,
      paymentMethod,
      status,
    });
  }

  async trackQuizAttempt(quizId, courseName, score, totalQuestions) {
    await this.trackEvent('quiz_attempt', {
      quizId,
      courseName,
      score,
      totalQuestions,
      percentage: (score / totalQuestions) * 100,
    });
  }

  async trackAssignmentSubmission(assignmentId, courseName, onTime) {
    await this.trackEvent('assignment_submission', {
      assignmentId,
      courseName,
      onTime,
    });
  }

  async trackVideoPlayback(courseId, lectureId, duration, watchTime) {
    await this.trackEvent('video_playback', {
      courseId,
      lectureId,
      duration,
      watchTime,
      completionPercentage: (watchTime / duration) * 100,
    });
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };
  }

  async getSessionDuration() {
    if (!this.sessionStartTime) return 0;
    const endTime = new Date();
    const duration = endTime - this.sessionStartTime;
    return Math.floor(duration / 1000); // Return in seconds
  }

  async endSession() {
    const sessionDuration = await this.getSessionDuration();
    await this.trackEvent('session_end', {
      duration: sessionDuration,
      startTime: this.sessionStartTime?.toISOString(),
      endTime: new Date().toISOString(),
    });
    this.sessionStartTime = null;
  }

  async getUserAnalytics(userId) {
    try {
      const response = await analyticsAPI.getUserAnalytics(userId);
      return response.data;
    } catch (error) {
      console.log('Error getting user analytics:', error);
      return null;
    }
  }

  async getAnalyticsSummary() {
    try {
      const response = await analyticsAPI.getAnalyticsSummary();
      return response.data;
    } catch (error) {
      console.log('Error getting analytics summary:', error);
      return null;
    }
  }
}

export default new AnalyticsService();
