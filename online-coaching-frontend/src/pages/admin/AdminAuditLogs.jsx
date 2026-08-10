import { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Trash2,
  Download
} from 'lucide-react';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter, entityFilter, dateRange]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/audit-logs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load audit logs');
      console.error(err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Entity filter
    if (entityFilter !== 'all') {
      filtered = filtered.filter(log => log.entityType === entityFilter);
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.createdAt);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && logDate < startDate) return false;
        if (endDate && logDate > endDate) return false;
        return true;
      });
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action) => {
    switch (action?.toUpperCase()) {
      case 'CREATE': return CheckCircle;
      case 'UPDATE': return FileText;
      case 'DELETE': return Trash2;
      case 'LOGIN': return User;
      case 'LOGOUT': return XCircle;
      case 'APPROVE': return CheckCircle;
      case 'REJECT': return XCircle;
      default: return Shield;
    }
  };

  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case 'CREATE': return 'bg-green-100 text-green-600';
      case 'UPDATE': return 'bg-blue-100 text-blue-600';
      case 'DELETE': return 'bg-red-100 text-red-600';
      case 'LOGIN': return 'bg-purple-100 text-purple-600';
      case 'LOGOUT': return 'bg-gray-100 text-gray-600';
      case 'APPROVE': return 'bg-green-100 text-green-600';
      case 'REJECT': return 'bg-red-100 text-red-600';
      default: return 'bg-yellow-100 text-yellow-600';
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.createdAt,
        log.userName || 'System',
        log.action,
        log.entityType,
        log.entityId || 'N/A',
        log.ipAddress || 'N/A',
        log.newValue || log.oldValue || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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

  const uniqueActions = [...new Set(logs.map(log => log.action))];
  const uniqueEntities = [...new Set(logs.map(log => log.entityType))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Audit Logs</h1>
          <p className="text-gray-600">Track all system activities and admin actions</p>
        </div>
        <button
          onClick={exportLogs}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Search logs..."
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* Entity Filter */}
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-gray-500" />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Entities</option>
              {uniqueEntities.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input-field"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input-field"
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">System Activities</h2>
          <span className="text-sm text-gray-500">{filteredLogs.length} entries</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Shield size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No audit logs found</p>
            <p className="text-sm mt-2">Audit logs will be automatically created when users perform actions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Entity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">IP Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const ActionIcon = getActionIcon(log.action);
                  return (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                              {log.userName?.charAt(0) || 'S'}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{log.userName || 'System'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getActionColor(log.action)}`}>
                          <ActionIcon size={14} />
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        <div>
                          <span className="font-medium">{log.entityType}</span>
                          {log.entityId && <span className="text-sm text-gray-500 ml-1">#{log.entityId}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {log.ipAddress || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        <div className="max-w-xs">
                          {log.newValue && (
                            <div className="text-sm">
                              <span className="text-green-600">New:</span> {log.newValue.substring(0, 50)}
                              {log.newValue.length > 50 && '...'}
                            </div>
                          )}
                          {log.oldValue && (
                            <div className="text-sm">
                              <span className="text-red-600">Old:</span> {log.oldValue.substring(0, 50)}
                              {log.oldValue.length > 50 && '...'}
                            </div>
                          )}
                          {!log.newValue && !log.oldValue && <span className="text-sm text-gray-400">No details</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;