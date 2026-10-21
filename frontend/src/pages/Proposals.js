import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Proposals() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);

  const load = async () => {
    const { data } = await api.get('/proposals');
    setProposals(data);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/proposals/${id}`, { status });
    load();
  };

  return (
    <div className="page">
      <h1 className="page-title">{user.role === 'creator' ? 'My Proposals' : 'Proposal Management'}</h1>
      <p className="page-sub">
        {user.role === 'creator'
          ? 'Track the status of every proposal you have sent.'
          : 'Review and respond to creator proposals.'}
      </p>

      {proposals.length === 0 && <div className="empty">No proposals yet.</div>}

      {proposals.map((p) => (
        <div className="card" key={p._id}>
          <div className="row">
            <div>
              <div style={{ fontWeight: 700 }}>{p.campaign?.name}</div>
              {user.role !== 'creator' && (
                <div className="muted">by {p.creator?.name} ({p.creator?.email})</div>
              )}
              <div className="muted">₹{p.rate} · {p.deliverables}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${p.status}`}>{p.status}</span>
              {user.role === 'brand' && p.status === 'pending' && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <button className="btn-secondary" onClick={() => updateStatus(p._id, 'negotiating')}>Negotiate</button>
                  <button className="btn-secondary" onClick={() => updateStatus(p._id, 'rejected')}>Reject</button>
                  <button className="btn-primary" onClick={() => updateStatus(p._id, 'accepted')}>Accept</button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Proposals;
