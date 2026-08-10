import { useState, useEffect } from 'react';
import { supportTicketAPI } from '../../services/api';
import { 
  Ticket, 
  Users, 
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  XCircle,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, filter, searchTerm]);

  const fetchTickets = async () => {
    try {
      const response = await supportTicketAPI.getAllTickets();
      if (response && response.data) {
        setTickets(response.data);
      } else {
        setTickets([]);
      }
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (filter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status.toLowerCase() === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await supportTicketAPI.updateTicket(ticketId, { status: newStatus.toUpperCase() });
      fetchTickets();
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket || !resolution) return;

    try {
      await supportTicketAPI.updateTicket(selectedTicket.id, { 
        status: 'RESOLVED',
        resolution: resolution 
      });
      fetchTickets();
      setShowModal(false);
      setSelectedTicket(null);
      setResolution('');
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-600';
      case 'in_progress': return 'bg-yellow-100 text-yellow-600';
      case 'resolved': return 'bg-green-100 text-green-600';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'bg-green-50 text-green-600 border-green-200';
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'urgent': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'technical': return AlertCircle;
      case 'billing': return TrendingUp;
      case 'account': return Users;
      case 'course_content': return FileText;
      case 'enrollment': return CheckCircle;
      case 'certificate': return CheckCircle;
      default: return MessageSquare;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card flex items-center gap-3 text-red-600">
        <AlertCircle size={24} />
        <span>{error}</span>
      </div>
    );
  }

  const stats = [
    { label: 'Total Tickets', value: tickets.length, icon: Ticket, color: 'bg-blue-500' },
    { label: 'Open', value: tickets.filter(t => t.status === 'OPEN').length, icon: Clock, color: 'bg-yellow-500' },
    { label: 'In Progress', value: tickets.filter(t => t.status === 'IN_PROGRESS').length, icon: AlertCircle, color: 'bg-orange-500' },
    { label: 'Resolved', value: tickets.filter(t => t.status === 'RESOLVED').length, icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Support Tickets</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Ticket size={18} />
          <span>Manage all support requests</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className="text-gray-700" size={20} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
          <span className="text-sm text-gray-500">{filteredTickets.length} tickets</span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Ticket size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No tickets found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const CategoryIcon = getCategoryIcon(ticket.category);
              return (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-primary-600">{ticket.ticketNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{ticket.userName || 'Unknown User'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CategoryIcon size={16} />
                          <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(ticket.id, 'IN_PROGRESS')}
                            className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowModal(true);
                            }}
                            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      {ticket.status === 'RESOLVED' && (
                        <button
                          onClick={() => handleStatusChange(ticket.id, 'CLOSED')}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {ticket.resolution && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="font-medium text-green-600">Resolution:</span>
                        <span className="text-gray-700">{ticket.resolution}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resolve Ticket</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTicket(null);
                  setResolution('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Ticket:</span> {selectedTicket.ticketNumber}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Subject:</span> {selectedTicket.subject}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Description:</span> {selectedTicket.description}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter the resolution for this ticket..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTicket(null);
                  setResolution('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveTicket}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Submit Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;