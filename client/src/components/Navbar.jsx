import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <Link to="/" className="brand">ATS Resume Checker</Link>
      <div className="nav-right">
        {user ? (
          <>
            <span>{user.name}</span>
            <button className="btn btn-secondary" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register"><button className="btn">Get started</button></Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;