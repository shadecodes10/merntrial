import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const copyByRole = {
  creator: {
    heading: 'Find paid campaigns and manage your collaborations.',
    links: [
      ['/campaigns', 'Discover Campaigns'],
      ['/proposals', 'My Proposals'],
      ['/tasks', 'My Tasks'],
      ['/invoices', 'My Invoices'],
    ],
  },
  brand: {
    heading: 'Launch campaigns and manage creator proposals.',
    links: [
      ['/campaigns', 'Manage Campaigns'],
      ['/proposals', 'Review Proposals'],
    ],
  },
  talent: {
    heading: 'Assign and track tasks for your creators.',
    links: [
      ['/campaigns', 'View Campaigns'],
      ['/tasks', 'Assign & Track Tasks'],
    ],
  },
  finance: {
    heading: 'Generate invoices and track payments.',
    links: [
      ['/invoices', 'Manage Invoices'],
    ],
  },
};

function Dashboard() {
  const { user } = useAuth();
  const info = copyByRole[user.role];

  return (
    <div className="page">
      <h1 className="page-title">Good morning, {user.name}</h1>
      <p className="page-sub">{info.heading}</p>
      <div className="card">
        <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
          {info.links.map(([to, label]) => (
            <Link key={to} to={to}>
              <button className="btn-secondary">{label}</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
