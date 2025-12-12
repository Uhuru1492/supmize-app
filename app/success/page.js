export default function Success() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🎉</div>
        <h1 style={styles.title}>Welcome to Supmize Pro!</h1>
        <p style={styles.text}>
          Your subscription is now active. Return to the app to enjoy unlimited access!
        </p>
        <p style={styles.note}>
          You can close this page and return to the Supmize app.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  icon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: '20px'
  },
  text: {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '30px'
  },
  note: {
    fontSize: '14px',
    color: '#999'
  }
}
