import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, XCircle, Search } from 'lucide-react';
import { supportTicketAPI } from '../services/api';

const SupportTickets = () => {
  const { colors } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM',
    category: 'GENERAL'
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await supportTicketAPI.getUserTickets(user.id);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await supportTicketAPI.createTicket({
        ...formData,
        userId: user.id,
        status: 'OPEN'
      });
      setShowModal(false);
      setFormData({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        category: 'GENERAL'
      });
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return colors.error;
      case 'IN_PROGRESS': return colors.warning;
      case 'RESOLVED': return colors.success;
      case 'CLOSED': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <AlertCircle size={20} />;
      case 'IN_PROGRESS': return <Clock size={20} />;
      case 'RESOLVED': return <CheckCircle size={20} />;
      case 'CLOSED': return <XCircle size={20} />;
      default: return <MessageSquare size={20} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return colors.error;
      case 'MEDIUM': return colors.warning;
      case 'LOW': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Support Tickets</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: colors.primary, color: colors.onError }}
          >
            <Plus size={20} />
            New Ticket
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSecondary }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${filter === status ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  ringColor: filter === status ? colors.primary : 'transparent'
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <MessageSquare size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Support Tickets</h3>
            <p style={{ color: colors.textSecondary }}>
              {searchTerm ? 'Try a different search term' : 'Create a support ticket to get help'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm" style={{
                        backgroundColor: getStatusColor(ticket.status) + '20',
                        color: getStatusColor(ticket.status)
                      }}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm" style={{
                        backgroundColor: getPriorityColor(ticket.priority) + '20',
                        color: getPriorityColor(ticket.priority)
                      }}>
                        {ticket.priority}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm" style={{
                        backgroundColor: colors.surfaceVariant,
                        color: colors.textSecondary
                      }}>
                        {ticket.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                      {ticket.subject}
                    </h3>
                    
                    <p className="text-sm mb-3 line-clamp-2" style={{ color: colors.textSecondary }}>
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                      <span>Ticket #{ticket.ticketNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Ticket Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Create Support Ticket</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      rows={4}
                      placeholder="Detailed description of your issue"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg"
                        style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg"
                        style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      >
                        <option value="GENERAL">General</option>
                        <option value="TECHNICAL">Technical</option>
                        <option value="BILLING">Billing</option>
                        <option value="COURSE">Course Related</option>
                        <option value="ACCOUNT">Account</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary, color: colors.onError }}
                  >
                    Submit Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Ticket #{selectedTicket.ticketNumber}</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm" style={{
                    backgroundColor: getStatusColor(selectedTicket.status) + '20',
                    color: getStatusColor(selectedTicket.status)
                  }}>
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm" style={{
                    backgroundColor: getPriorityColor(selectedTicket.priority) + '20',
                    color: getPriorityColor(selectedTicket.priority)
                  }}>
                    {selectedTicket.priority}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                  {selectedTicket.subject}
                </h3>
                
                <p className="mb-4" style={{ color: colors.text }}>
                  {selectedTicket.description}
                </p>
                
                <div className="space-y-2 mb-4 text-sm" style={{ color: colors.textSecondary }}>
                  <div>Category: {selectedTicket.category}</div>
                  <div>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</div>
                  {selectedTicket.updatedAt && (
                    <div>Last Updated: {new Date(selectedTicket.updatedAt).toLocaleString()}</div>
                  )}
                  {selectedTicket.resolvedAt && (
                    <div>Resolved: {new Date(selectedTicket.resolvedAt).toLocaleString()}</div>
                  )}
                </div>
                
                {selectedTicket.resolution && (
                  <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: colors.success + '20' }}>
                    <h4 className="font-semibold mb-2" style={{ color: colors.success }}>Resolution</h4>
                    <p style={{ color: colors.text }}>{selectedTicket.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;