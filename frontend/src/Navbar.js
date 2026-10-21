import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// The same navbar changes its links depending on req.user's role — this is
// the simplest way to show "4 stakeholder interfaces, 1 codebase".
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linksByRole = {
    creator: [
      ['/campaigns', 'Discover Campaigns'],
      ['/proposals', 'My Proposals'],
      ['/tasks', 'My Tasks'],
      ['/invoices', 'My Invoices'],
    ],
    brand: [
      ['/campaigns', 'Campaigns'],
      ['/proposals', 'Proposals'],
    ],
    talent: [
      ['/campaigns', 'Campaigns'],
      ['/tasks', 'Tasks'],
    ],
    finance: [
      ['/invoices', 'Invoices'],
    ],
  };

  return (
    <div className="navbar">
      <div className="logo">CreatorHub</div>
      <div className="links">
        <Link to="/dashboard">Dashboard</Link>
        {linksByRole[user.role].map(([to, label]) => (
          <Link key={to} to={to}>{label}</Link>
        ))}
        <span className="role-tag">{user.role}</span>
        <a href="#logout" onClick={handleLogout}>Logout</a>
      </div>
    </div>
  );
}

export default Navbar;
