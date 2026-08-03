import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Award, Download, Share2, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { certificateAPI } from '../../services/api';

const Certificates = () => {
  const { colors } = useTheme();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedCertificate, setVerifiedCertificate] = useState(null);
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await certificateAPI.getStudentCertificates(user.id);
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificate = async () => {
    try {
      const response = await certificateAPI.verifyCertificate(verificationCode);
      setVerifiedCertificate(response.data);
    } catch (error) {
      alert('Invalid verification code');
      setVerifiedCertificate(null);
    }
  };

  const downloadCertificate = (certificate) => {
    if (certificate.certificateUrl) {
      window.open(certificate.certificateUrl, '_blank');
    } else {
      alert('Certificate PDF not available yet');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return colors.success;
      case 'REVOKED': return colors.error;
      case 'EXPIRED': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle size={20} />;
      case 'REVOKED': return <XCircle size={20} />;
      case 'EXPIRED': return <XCircle size={20} />;
      default: return <CheckCircle size={20} />;
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
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>My Certificates</h1>
          <button
            onClick={() => setShowVerification(!showVerification)}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: colors.primary, color: colors.onError }}
          >
            <ExternalLink size={20} />
            Verify Certificate
          </button>
        </div>

        {/* Verification Section */}
        {showVerification && (
          <div className="card p-6 mb-8" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>Verify Certificate</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code (e.g., VC-ABC12345)"
                className="flex-1 px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
              />
              <button
                onClick={verifyCertificate}
                className="px-6 py-2 rounded-lg"
                style={{ backgroundColor: colors.primary, color: colors.onError }}
              >
                Verify
              </button>
            </div>
            {verifiedCertificate && (
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: colors.success + '20' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: colors.success }}>
                  <CheckCircle size={20} />
                  <span className="font-semibold">Certificate Verified!</span>
                </div>
                <p style={{ color: colors.text }}>
                  <strong>Student:</strong> {verifiedCertificate.studentName}<br />
                  <strong>Course:</strong> {verifiedCertificate.courseName}<br />
                  <strong>Grade:</strong> {verifiedCertificate.grade}<br />
                  <strong>Percentage:</strong> {verifiedCertificate.percentage}%<br />
                  <strong>Issue Date:</strong> {verifiedCertificate.issueDate}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Award size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Certificates Yet</h3>
            <p style={{ color: colors.textSecondary }}>
              Complete your courses to earn certificates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="card overflow-hidden" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full" style={{ backgroundColor: colors.primary + '20' }}>
                      <Award size={32} style={{ color: colors.primary }} />
                    </div>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm" style={{ 
                      backgroundColor: getStatusColor(certificate.status) + '20',
                      color: getStatusColor(certificate.status)
                    }}>
                      {getStatusIcon(certificate.status)}
                      {certificate.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                    {certificate.courseName}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.textSecondary }}>Certificate No:</span>
                      <span style={{ color: colors.text }}>{certificate.certificateNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.textSecondary }}>Grade:</span>
                      <span style={{ color: colors.text }}>{certificate.grade || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.textSecondary }}>Percentage:</span>
                      <span style={{ color: colors.text }}>{certificate.percentage || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.textSecondary }}>Issue Date:</span>
                      <span style={{ color: colors.text }}>
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {certificate.expiryDate && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.textSecondary }}>Expiry Date:</span>
                        <span style={{ color: colors.text }}>
                          {new Date(certificate.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t flex gap-2" style={{ borderColor: colors.border }}>
                  <button
                    onClick={() => downloadCertificate(certificate)}
                    className="flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: colors.primary, color: colors.onError }}
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(certificate.verificationCode);
                      alert('Verification code copied!');
                    }}
                    className="px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
