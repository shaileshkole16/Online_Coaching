import AsyncStorage from '@react-native-async-storage/async-storage';

class AnalyticsService {
  constructor() {
    this.events = [];
    this.sessionStartTime = null;
  }

  async initialize() {
    this.sessionStartTime = new Date();
    await this.trackEvent('app_opened', {
      timestamp: this.sessionStartTime.toISOString(),
    });
  }

  async trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: await this.getSessionId(),
      },
    };

    this.events.push(event);
    
    // Store events locally (in production, send to analytics backend)
    await this.saveEvents();
    
    console.log('Analytics Event:', event);
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

  async getSessionId() {
    try {
      let sessionId = await AsyncStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await AsyncStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch (error) {
      console.log('Error getting session ID:', error);
      return 'session_' + Date.now();
    }
  }

  async saveEvents() {
    try {
      const existingEvents = await AsyncStorage.getItem('analyticsEvents');
      const allEvents = existingEvents ? JSON.parse(existingEvents) : [];
      allEvents.push(...this.events);
      await AsyncStorage.setItem('analyticsEvents', JSON.stringify(allEvents));
      this.events = []; // Clear local events after saving
    } catch (error) {
      console.log('Error saving analytics events:', error);
    }
  }

  async getEvents() {
    try {
      const events = await AsyncStorage.getItem('analyticsEvents');
      return events ? JSON.parse(events) : [];
    } catch (error) {
      console.log('Error getting analytics events:', error);
      return [];
    }
  }

  async clearEvents() {
    try {
      await AsyncStorage.removeItem('analyticsEvents');
    } catch (error) {
      console.log('Error clearing analytics events:', error);
    }
  }

  async getAnalyticsSummary() {
    const events = await this.getEvents();
    
    const summary = {
      totalEvents: events.length,
      eventsByType: {},
      uniqueUsers: new Set(),
      pageViews: {},
      courseEnrollments: 0,
      payments: 0,
      quizAttempts: 0,
    };

    events.forEach(event => {
      // Count events by type
      summary.eventsByType[event.name] = (summary.eventsByType[event.name] || 0) + 1;
      
      // Track page views
      if (event.name === 'page_view') {
        const pageName = event.properties.pageName;
        summary.pageViews[pageName] = (summary.pageViews[pageName] || 0) + 1;
      }
      
      // Track specific events
      if (event.name === 'course_enrollment') {
        summary.courseEnrollments++;
      }
      if (event.name === 'payment') {
        summary.payments++;
      }
      if (event.name === 'quiz_attempt') {
        summary.quizAttempts++;
      }
    });

    return summary;
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
}

export default new AnalyticsService();
