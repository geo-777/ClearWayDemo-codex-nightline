const SEVERITY_STYLES = {
  high: { backgroundColor: '#b91c1c', color: '#ffffff', borderColor: '#7f1d1d' },
  medium: { backgroundColor: '#c2410c', color: '#ffffff', borderColor: '#9a3412' },
  low: { backgroundColor: '#facc15', color: '#3b2f00', borderColor: '#ca8a04' },
};

function AlertBanner({ alertData }) {
  if (!alertData || !alertData.alert) {
    return <div className="alert-banner no-alert">No alert — monitoring...</div>;
  }

  const severity = alertData.severity || 'low';
  const severityStyle = SEVERITY_STYLES[severity] || SEVERITY_STYLES.low;

  return (
    <>
      <style>{`
        @keyframes alert-banner-pulse {
          50% { box-shadow: 0 0 28px rgba(220, 38, 38, 0.85); }
        }
      `}</style>
      <section
        className="alert-banner"
        style={{
          ...severityStyle,
          border: `2px solid ${severityStyle.borderColor}`,
          fontSize: '1.05rem',
          fontWeight: 600,
          animation: severity === 'high' ? 'alert-banner-pulse 1.1s ease-in-out infinite' : 'none',
        }}
        aria-live="assertive"
      >
        <strong>🚨 Ambulance {alertData.ambulanceId} approaching!</strong>
        <div style={{ marginTop: '0.35rem', fontSize: '0.95rem' }}>
          Distance: {alertData.distance}m · ETA: {alertData.eta}s · Severity: {severity.toUpperCase()}
        </div>
      </section>
    </>
  );
}

export default AlertBanner;
