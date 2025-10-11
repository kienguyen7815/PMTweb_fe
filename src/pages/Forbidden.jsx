
const Forbidden = () => {
  return (
    <div className="forbidden">
      <div className="forbidden-content">
        <div className="forbidden-icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <a href="/" className="btn btn-primary">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Forbidden; 