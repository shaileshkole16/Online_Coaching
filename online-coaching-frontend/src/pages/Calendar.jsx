import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react';
import { calendarEventAPI } from '../services/api';

const Calendar = () => {
  const { colors } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'OTHER',
    startDateTime: '',
    endDateTime: '',
    location: '',
    isAllDay: false,
    reminderMinutes: 15
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await calendarEventAPI.getUserEventsByRange(user.id, start.toISOString(), end.toISOString());
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const eventData = {
        ...formData,
        userId: user.id,
        status: 'SCHEDULED'
      };
      
      if (isEditing && selectedEvent) {
        await calendarEventAPI.updateEvent(selectedEvent.id, eventData);
      } else {
        await calendarEventAPI.createEvent(eventData);
      }
      
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        eventType: 'OTHER',
        startDateTime: '',
        endDateTime: '',
        location: '',
        isAllDay: false,
        reminderMinutes: 15
      });
      setIsEditing(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await calendarEventAPI.deleteEvent(eventId);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      startDateTime: event.startDateTime ? event.startDateTime.substring(0, 16) : '',
      endDateTime: event.endDateTime ? event.endDateTime.substring(0, 16) : '',
      location: event.location,
      isAllDay: event.isAllDay,
      reminderMinutes: event.reminderMinutes
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'ASSIGNMENT': return colors.error;
      case 'QUIZ': return colors.warning;
      case 'LECTURE': return colors.primary;
      case 'LIVE_CLASS': return colors.success;
      case 'EXAM': return colors.error;
      case 'MEETING': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Calendar</h1>
          <button
            onClick={() => {
              setIsEditing(false);
              setSelectedEvent(null);
              setFormData({
                title: '',
                description: '',
                eventType: 'OTHER',
                startDateTime: '',
                endDateTime: '',
                location: '',
                isAllDay: false,
                reminderMinutes: 15
              });
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: colors.primary, color: colors.onError }}
          >
            <Plus size={20} />
            Add Event
          </button>
        </div>

        {/* Calendar Header */}
        <div className="card mb-6 p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold py-2" style={{ color: colors.textSecondary }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(startingDay)].map((_, index) => (
              <div key={`empty-${index}`} className="p-4"></div>
            ))}
            {[...Array(daysInMonth)].map((_, index) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1);
              const dayEvents = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index + 1}
                  className={`p-2 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                    isToday ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: isToday ? colors.primary : colors.border,
                    borderWidth: isToday ? '2px' : '1px'
                  }}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="text-center mb-1" style={{ color: colors.text }}>
                    {index + 1}
                  </div>
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="text-xs p-1 rounded mb-1 truncate"
                      style={{
                        backgroundColor: getEventTypeColor(event.eventType) + '30',
                        color: getEventTypeColor(event.eventType)
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-center" style={{ color: colors.textSecondary }}>
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
                Events for {selectedDate.toLocaleDateString()}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
              >
                ✕
              </button>
            </div>
            {getEventsForDate(selectedDate).length === 0 ? (
              <p style={{ color: colors.textSecondary }}>No events for this date</p>
            ) : (
              <div className="space-y-4">
                {getEventsForDate(selectedDate).map((event) => (
                  <div key={event.id} className="p-4 rounded-lg" style={{ backgroundColor: colors.background, borderLeft: `4px solid ${getEventTypeColor(event.eventType)}` }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded text-sm" style={{ backgroundColor: getEventTypeColor(event.eventType) + '20', color: getEventTypeColor(event.eventType) }}>
                            {event.eventType}
                          </span>
                          <h4 className="font-semibold" style={{ color: colors.text }}>{event.title}</h4>
                        </div>
                        <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{event.description}</p>
                        <div className="flex items-center gap-4 text-sm" style={{ color: colors.text }}>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(event.startDateTime).toLocaleTimeString()}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: colors.warning + '20', color: colors.warning }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: colors.error + '20', color: colors.error }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Event Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="card max-w-md w-full" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
              <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                {isEditing ? 'Edit Event' : 'Add Event'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.text }}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Event title..."
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.text }}>Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                >
                  <option value="OTHER">Other</option>
                  <option value="ASSIGNMENT">Assignment</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="LECTURE">Lecture</option>
                  <option value="LIVE_CLASS">Live Class</option>
                  <option value="EXAM">Exam</option>
                  <option value="MEETING">Meeting</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.text }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description..."
                  className="w-full p-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.text }}>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Location..."
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isAllDay}
                  onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                  id="allDay"
                />
                <label htmlFor="allDay" style={{ color: colors.text }}>All Day Event</label>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary, color: colors.onError }}
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Calendar;
