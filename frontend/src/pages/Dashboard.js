import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const copyByRole = {
  creator: {
    heading: 'Find paid campaigns and manage your collaborations.',
    links: [
      ['/campaigns', '🔍', 'Discover Campaigns'],
      ['/proposals', '📨', 'My Proposals'],
      ['/tasks', '✅', 'My Tasks'],
      ['/invoices', '💸', 'My Invoices'],
    ],
  },
  brand: {
    heading: 'Launch campaigns and manage creator proposals.',
    links: [
      ['/campaigns', '📣', 'Manage Campaigns'],
      ['/proposals', '📨', 'Review Proposals'],
    ],
  },
  talent: {
    heading: 'Assign and track tasks for your creators.',
    links: [
      ['/campaigns', '📣', 'View Campaigns'],
      ['/tasks', '✅', 'Assign & Track Tasks'],
    ],
  },
  finance: {
    heading: 'Generate invoices and track payments.',
    links: [['/invoices', '💸', 'Manage Invoices']],
  },
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const count = (arr, fn) => arr.filter(fn).length;
const sum = (arr, fn) => arr.reduce((t, x) => t + (fn(x) || 0), 0);
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '');

function Dashboard() {
  const { user } = useAuth();
  const info = copyByRole[user.role];
  const [data, setData] = useState({ campaigns: [], proposals: [], tasks: [], invoices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const want = {
      creator: ['campaigns', 'proposals', 'tasks', 'invoices'],
      brand: ['campaigns', 'proposals'],
      talent: ['campaigns', 'tasks'],
      finance: ['invoices'],
    }[user.role];
    Promise.all(
      want.map((k) =>
        api.get(`/${k}`).then((r) => [k, r.data]).catch(() => [k, []])
      )
    ).then((entries) => {
      setData((d) => ({ ...d, ...Object.fromEntries(entries) }));
      setLoading(false);
    });
  }, [user.role]);

  const { campaigns, proposals, tasks, invoices } = data;

  // ---- per-role stats, activity feed and status breakdown ----
  let stats = [], activity = [], breakdownTitle = '', breakdown = [];

  if (user.role === 'creator') {
    stats = [
      ['📣', 't1', campaigns.length, 'Open campaigns'],
      ['📨', 't2', count(proposals, (p) => p.status === 'pending'), 'Pending proposals'],
      ['✅', 't3', count(tasks, (t) => t.status !== 'Completed'), 'Active tasks'],
      ['💰', 't4', money(sum(invoices, (i) => (i.status === 'Paid' ? i.amount : 0))), 'Earned so far'],
    ];
    activity = [
      ...tasks.map((t) => ({ icon: '✅', title: t.title, sub: t.campaign?.name, tag: t.status, at: t.updatedAt })),
      ...proposals.map((p) => ({ icon: '📨', title: `Proposal: ${p.campaign?.name || 'Campaign'}`, sub: money(p.rate), tag: p.status, at: p.updatedAt })),
      ...invoices.map((i) => ({ icon: '💸', title: `Invoice ${money(i.amount)}`, sub: i.campaign?.name, tag: i.status, at: i.updatedAt })),
    ];
    breakdownTitle = 'Task progress';
    breakdown = ['Not Started', 'In Progress', 'Under Review', 'Completed'].map((s) => [s, count(tasks, (t) => t.status === s)]);
  } else if (user.role === 'brand') {
    stats = [
      ['📣', 't1', count(campaigns, (c) => c.status === 'published'), 'Live campaigns'],
      ['📝', 't2', count(campaigns, (c) => c.status === 'draft'), 'Drafts'],
      ['📨', 't3', count(proposals, (p) => p.status === 'pending'), 'Proposals to review'],
      ['🤝', 't4', count(proposals, (p) => p.status === 'accepted'), 'Creators signed'],
    ];
    activity = [
      ...proposals.map((p) => ({ icon: '📨', title: `${p.creator?.name || 'A creator'} → ${p.campaign?.name || 'Campaign'}`, sub: money(p.rate), tag: p.status, at: p.updatedAt })),
      ...campaigns.map((c) => ({ icon: '📣', title: c.name, sub: c.platform || c.brand, tag: c.status, at: c.updatedAt })),
    ];
    breakdownTitle = 'Proposal pipeline';
    breakdown = ['pending', 'negotiating', 'accepted', 'rejected'].map((s) => [s, count(proposals, (p) => p.status === s)]);
  } else if (user.role === 'talent') {
    stats = [
      ['📣', 't1', campaigns.length, 'Campaigns'],
      ['🗂️', 't2', tasks.length, 'Tasks assigned'],
      ['⏳', 't3', count(tasks, (t) => t.status === 'In Progress' || t.status === 'Under Review'), 'In flight'],
      ['🏁', 't4', count(tasks, (t) => t.status === 'Completed'), 'Completed'],
    ];
    activity = tasks.map((t) => ({ icon: '✅', title: t.title, sub: `${t.creator?.name || 'Creator'} · ${t.campaign?.name || ''}`, tag: t.status, at: t.updatedAt }));
    breakdownTitle = 'Task progress';
    breakdown = ['Not Started', 'In Progress', 'Under Review', 'Completed'].map((s) => [s, count(tasks, (t) => t.status === s)]);
  } else {
    stats = [
      ['🧾', 't1', invoices.length, 'Invoices raised'],
      ['⏳', 't2', money(sum(invoices, (i) => (i.status === 'Pending' || i.status === 'Processing' ? i.amount : 0))), 'Outstanding'],
      ['💰', 't3', money(sum(invoices, (i) => (i.status === 'Paid' ? i.amount : 0))), 'Paid out'],
      ['⚠️', 't4', count(invoices, (i) => i.status === 'Failed'), 'Failed payments'],
    ];
    activity = invoices.map((i) => ({ icon: '💸', title: `${i.creator?.name || 'Creator'} · ${money(i.amount)}`, sub: i.campaign?.name, tag: i.status, at: i.updatedAt }));
    breakdownTitle = 'Payment status';
    breakdown = ['Pending', 'Processing', 'Paid', 'Failed'].map((s) => [s, count(invoices, (i) => i.status === s)]);
  }

  activity = activity.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6);
  const total = breakdown.reduce((t, [, n]) => t + n, 0) || 1;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="page">
      <div className="dash-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="dash-date">{today}</div>
          <h1>{greeting()}, {user.name} 👋</h1>
          <p>{info.heading}</p>
        </div>
        <span className="role-pill">{user.role === 'talent' ? 'Talent Manager' : user.role === 'finance' ? 'Finance Manager' : user.role}</span>
      </div>

      <div className="stat-grid">
        {stats.map(([icon, tone, value, label]) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${tone}`}>{icon}</div>
            <div>
              <div className="stat-value">{loading ? '–' : value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-cols">
        <div className="card">
          <h3 className="dash-section-title">Recent activity</h3>
          {loading ? (
            <div className="empty">Loading…</div>
          ) : activity.length === 0 ? (
            <div className="empty">Nothing yet — head to a section below to get started.</div>
          ) : (
            activity.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot">{a.icon}</div>
                <div className="activity-main">
                  <div className="activity-title">{a.title}</div>
                  <div className="muted">{a.sub}{a.at ? ` · ${fmtDate(a.at)}` : ''}</div>
                </div>
                <span className={`badge ${a.tag}`}>{a.tag}</span>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="card">
            <h3 className="dash-section-title">Quick actions</h3>
            <div className="quick-actions">
              {info.links.map(([to, icon, label]) => (
                <Link key={to} to={to} className="quick-action">
                  <span>{icon}</span>{label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="dash-section-title">{breakdownTitle}</h3>
            {breakdown.map(([label, n]) => (
              <div className="bar-row" key={label}>
                <div className="bar-label"><span>{label}</span><strong>{n}</strong></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(n / total) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
