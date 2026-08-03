import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Download, FileText, Table, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

const ReportsExport = ({ onExport }) => {
  const { colors } = useTheme();
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exportFormat, setExportFormat] = useState('pdf');

  const reportTypes = [
    { value: 'student', label: 'Student Report', icon: Users },
    { value: 'teacher', label: 'Teacher Report', icon: Users },
    { value: 'attendance', label: 'Attendance Report', icon: Table },
    { value: 'revenue', label: 'Revenue Report', icon: DollarSign },
    { value: 'course', label: 'Course Report', icon: FileText },
    { value: 'analytics', label: 'Analytics Report', icon: TrendingUp }
  ];

  const handleExport = () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }
    onExport(selectedReport, dateRange, exportFormat);
  };

  return (
    <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
      <h3 className="text-lg font-semibold mb-6" style={{ color: colors.text }}>Generate Reports</h3>

      <div className="space-y-4">
        {/* Report Type Selection */}
        <div>
          <label className="block mb-2 text-sm font-medium" style={{ color: colors.text }}>
            Report Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.value}
                  onClick={() => setSelectedReport(report.value)}
                  className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    selectedReport === report.value ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: selectedReport === report.value ? colors.primary : colors.border,
                    borderWidth: '1px'
                  }}
                >
                  <Icon size={24} style={{ color: selectedReport === report.value ? colors.primary : colors.textSecondary }} />
                  <span className="text-sm text-center" style={{ color: colors.text }}>{report.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block mb-2 text-sm font-medium" style={{ color: colors.text }}>
            Date Range
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-xs" style={{ color: colors.textSecondary }}>Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-xs" style={{ color: colors.textSecondary }}>End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
              />
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div>
          <label className="block mb-2 text-sm font-medium" style={{ color: colors.text }}>
            Export Format
          </label>
          <div className="flex gap-3">
            {['pdf', 'excel', 'csv'].map((format) => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  exportFormat === format ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: colors.background,
                  borderColor: exportFormat === format ? colors.primary : colors.border,
                  borderWidth: '1px',
                  color: colors.text
                }}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: colors.primary, color: colors.onError }}
        >
          <Download size={20} />
          Export Report
        </button>
      </div>
    </div>
  );
};

export default ReportsExport;
