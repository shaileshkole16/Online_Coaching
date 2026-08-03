import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Download, FileText, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';
import axios from 'axios';

const PaymentHistory = () => {
  const { colors } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:8080/api/payments/student/${user.id}`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (paymentId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/payments/${paymentId}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return colors.success;
      case 'PENDING': return colors.warning;
      case 'FAILED': return colors.error;
      case 'REFUNDED': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={20} />;
      case 'PENDING': return <Clock size={20} />;
      case 'FAILED': return <XCircle size={20} />;
      case 'REFUNDED': return <FileText size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = payment.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.text }}>Payment History</h1>

        {/* Filters */}
        <div className="card p-6 mb-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSecondary }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by course name or transaction ID..."
                className="w-full pl-10 pr-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} style={{ color: colors.textSecondary }} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
              >
                <option value="all">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment List */}
        {filteredPayments.length === 0 ? (
          <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <FileText size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Payment Records Found</h3>
            <p style={{ color: colors.textSecondary }}>
              {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Your payment history will appear here'}
            </p>
          </div>
        ) : (
          <div className="card" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.surfaceVariant }}>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b" style={{ borderColor: colors.border }}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm" style={{ color: colors.text }}>
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                        {payment.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold" style={{ color: colors.text }}>
                        ₹{payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-2" style={{ color: getStatusColor(payment.status) }}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                        {payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.status === 'COMPLETED' ? (
                          <button
                            onClick={() => downloadInvoice(payment.id)}
                            className="px-3 py-1 rounded-lg flex items-center gap-2 text-sm"
                            style={{ backgroundColor: colors.primary + '20', color: colors.primary }}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        ) : (
                          <span className="text-sm" style={{ color: colors.textSecondary }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
