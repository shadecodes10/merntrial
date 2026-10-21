import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '', brand: '', description: '', targetAudience: '', niche: '',
  platform: '', deliverables: '', budget: '', startDate: '', endDate: '',
};

function Campaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const loadCampaigns = async () => {
    const { data } = await api.get('/campaigns');
    setCampaigns(data);
  };

  useEffect(() => { loadCampaigns(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/campaigns', form);
    setForm(emptyForm);
    setShowForm(false);
    loadCampaigns();
  };

  const publish = async (id) => {
    await api.put(`/campaigns/${id}`, { status: 'published' });
    loadCampaigns();
  };

  return (
    <div className="page">
      <h1 className="page-title">
        {user.role === 'brand' ? 'Campaigns' : 'Discover Campaigns'}
      </h1>
      <p className="page-sub">
        {user.role === 'brand'
          ? 'Create and publish collaborations for creators to discover.'
          : 'Browse live collaborations.'}
      </p>

      {user.role === 'brand' && (
        <div className="card">
          <div className="row">
            <strong>New Campaign</strong>
            <button className="btn-secondary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Campaign'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} style={{ marginTop: 16 }}>
              <label>Campaign Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} required />
              <label>Description</label>
              <textarea name="description" rows="2" value={form.description} onChange={handleChange} />
              <label>Target Audience</label>
              <input name="targetAudience" value={form.targetAudience} onChange={handleChange} />
              <label>Content Niche</label>
              <input name="niche" value={form.niche} onChange={handleChange} />
              <label>Platform</label>
              <input name="platform" value={form.platform} onChange={handleChange} />
              <label>Deliverables</label>
              <input name="deliverables" value={form.deliverables} onChange={handleChange} />
              <label>Budget</label>
              <input name="budget" value={form.budget} onChange={handleChange} placeholder="₹25,000 - ₹40,000" />
              <div className="row">
                <div style={{ flex: 1 }}>
                  <label>Start Date</label>
                  <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>End Date</label>
                  <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Save as Draft
              </button>
            </form>
          )}
        </div>
      )}

      {campaigns.length === 0 && <div className="empty">No campaigns yet.</div>}

      {campaigns.map((c) => (
        <div className="card" key={c._id}>
          <div className="row">
            <div>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div className="muted">{c.brand} · {c.niche} · {c.platform}</div>
              <div className="muted">{c.budget}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${c.status}`}>{c.status}</span>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <Link to={`/campaigns/${c._id}`}>
                  <button className="btn-secondary">View</button>
                </Link>
                {user.role === 'brand' && c.status === 'draft' && (
                  <button className="btn-primary" onClick={() => publish(c._id)}>Publish</button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Campaigns;
