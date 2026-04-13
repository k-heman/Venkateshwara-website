import { useEffect, useState } from 'react';
import { Users, BarChart3, TrendingUp, Filter, Smartphone, CalendarDays, Eye, LayoutGrid } from 'lucide-react';
import { getUsers, getGuestVisits, getProductViews, getProducts } from '../services/db';

export default function AdminStatistics() {
  const [users, setUsers] = useState<any[]>([]);
  const [guestVisits, setGuestVisits] = useState<any[]>([]);
  const [productViews, setProductViews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<number | 'all'>('all'); // days or 'all'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, guestsData, viewsData, productsData] = await Promise.all([
        getUsers(),
        getGuestVisits(),
        getProductViews(),
        getProducts()
      ]);
      const sortedUsers = usersData.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      setUsers(sortedUsers);
      setGuestVisits(guestsData);
      setProductViews(viewsData);
      setProducts(productsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (items: any[]) => {
    if (timeFilter === 'all') return items;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeFilter);
    return items.filter(item => new Date(item.timestamp) >= cutoffDate);
  };

  const filteredGuests = filterByDate(guestVisits);
  const filteredViews = filterByDate(productViews);

  const viewCounts = filteredViews.reduce((acc, view) => {
    acc[view.productId] = (acc[view.productId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(viewCounts)
    .map(([productId, count]) => {
      const product = products.find(p => p.id === productId);
      return { 
        id: productId, 
        name: product?.name || 'Unknown Product', 
        category: product?.category || 'Unknown',
        price: product?.price || 0,
        image: product?.image || '/logo.png',
        views: count 
      };
    })
    .sort((a, b) => (b.views as number) - (a.views as number));

  if (loading) return (
    <div className="flex-col flex-center" style={{ minHeight: '60vh', color: 'var(--text-muted)' }}>
      <BarChart3 size={48} className="animate-pulse mb-4 text-primary" />
      <h2 className="heading-md">Loading Platform Statistics...</h2>
    </div>
  );

  return (
    <>
      <div className="stats-container animate-fade-in">
        {/* HEADER & FILTERS */}
        <div className="stats-header card glass">
          <div className="flex items-center gap-3">
            <div className="header-icon-wrapper">
              <BarChart3 size={28} />
            </div>
            <div>
              <h2 className="heading-md text-primary" style={{ marginBottom: 0 }}>Platform Statistics</h2>
              <p className="text-muted text-sm">Monitor your website's traffic and user engagement.</p>
            </div>
          </div>
          
          <div className="filter-wrapper">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
              <Filter size={16} /> Time Range
            </label>
            <div className="select-container">
              <select 
                className="custom-select"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              >
                <option value="all">All Time</option>
                <option value={3}>Last 3 Days</option>
                <option value={7}>Last 1 Week</option>
                <option value={30}>Last 1 Month</option>
                <option value={90}>Last 3 Months</option>
                <option value={180}>Last 6 Months</option>
                <option value={365}>Last 1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* STAT OVERVIEW CARDS */}
        <div className="stats-grid top-cards">
          <div className="stat-card primary-gradient glass">
            <div className="stat-card-content">
              <div className="stat-text">
                <p className="stat-label">Total Guest Visits</p>
                <h3 className="stat-value">{filteredGuests.length}</h3>
                <p className="stat-subtext">In the selected {timeFilter === 'all' ? 'All Time' : `${timeFilter} days`} period</p>
              </div>
              <div className="stat-icon-large">
                <Users size={40} />
              </div>
            </div>
          </div>

          <div className="stat-card secondary-gradient glass">
            <div className="stat-card-content">
              <div className="stat-text">
                <p className="stat-label">Total Product Views</p>
                <h3 className="stat-value">{filteredViews.length}</h3>
                <p className="stat-subtext">In the selected {timeFilter === 'all' ? 'All Time' : `${timeFilter} days`} period</p>
              </div>
              <div className="stat-icon-large">
                <TrendingUp size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN METRICS GRID */}
        <div className="stats-grid main-metrics">
          
          {/* PRODUCT VIEWS (TOP) */}
          <div className="metric-panel card glass">
            <div className="panel-header">
              <div className="flex items-center gap-3">
                <span className="panel-icon bg-emerald-100 text-emerald-600"><LayoutGrid size={22} /></span>
                <h3 className="heading-sm">Most Viewed Products</h3>
              </div>
              <span className="badge bg-slate-100 text-slate-600">{topProducts.length} Items</span>
            </div>
            
            <div className="panel-body product-list custom-scrollbar">
              {topProducts.length === 0 ? (
                <div className="empty-state">
                  <Eye size={48} className="text-gray-300 mb-4" />
                  <p>No product views recorded yet for this period.</p>
                </div>
              ) : (
                <ul className="flex-col gap-4">
                  {topProducts.map((p, idx) => (
                    <li key={p.id} className="product-stat-item">
                      <div className="product-stat-rank shadow-sm">{idx + 1}</div>
                      <img src={p.image} alt={p.name} className="product-stat-img shadow-sm" />
                      <div className="product-stat-info">
                        <h4>{p.name}</h4>
                        <p>{p.category} • ₹{p.price}</p>
                      </div>
                      <div className="product-stat-count bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="font-bold text-lg">{String(p.views)}</span>
                        <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Views</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* REGISTERED USERS */}
          <div className="metric-panel card glass">
            <div className="panel-header">
              <div className="flex items-center gap-3">
                <span className="panel-icon bg-blue-100 text-blue-600"><Users size={22} /></span>
                <h3 className="heading-sm">Registered Users</h3>
              </div>
              <span className="badge bg-slate-100 text-slate-600">Total: {users.length}</span>
            </div>
            
            <div className="panel-body custom-scrollbar relative">
              <div className="desktop-table">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User Details</th>
                      <th>Mobile Number</th>
                      <th>Sign Up Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="user-avatar-sm shadow-sm">{u.username.charAt(0).toUpperCase()}</div>
                            <span className="font-semibold text-gray-800">{u.username}</span>
                          </div>
                        </td>
                        <td className="text-gray-600 font-medium">
                          <div className="flex items-center gap-2"><Smartphone size={14} className="text-gray-400" /> {u.mobileNumber || 'N/A'}</div>
                        </td>
                        <td className="text-gray-600 font-medium">
                          <div className="flex items-center gap-2"><CalendarDays size={14} className="text-gray-400" /> {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}</div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={3} className="text-center py-10 text-gray-500">No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS FOR USERS */}
              <div className="mobile-user-cards flex-col gap-4">
                {users.map(u => (
                  <div key={u.id} className="mobile-user-card shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="user-avatar-sm">{u.username.charAt(0).toUpperCase()}</div>
                      <span className="font-bold text-gray-800 text-lg break-all">{u.username}</span>
                    </div>
                    <div className="mobile-user-details">
                      <div className="detail-item">
                        <Smartphone size={16} className="text-primary" />
                        <span>{u.mobileNumber || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <CalendarDays size={16} className="text-primary" />
                        <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="empty-state">No users established yet.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .stats-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem 0;
        }

        /* Header */
        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-radius: 1.25rem;
          box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
          background: linear-gradient(to right, #ffffff, #f8fafc);
        }
        .header-icon-wrapper {
          background: rgba(30, 58, 138, 0.1);
          color: var(--color-primary);
          padding: 1rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .filter-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-end;
        }

        .custom-select {
          appearance: none;
          background: white url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>') no-repeat right 0.75rem center/16px;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.75rem 2.5rem 0.75rem 1rem;
          font-weight: 700;
          color: #1e293b;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 200px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .custom-select:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1);
        }

        /* Top Cards */
        .stats-grid {
          display: grid;
          gap: 2rem;
        }
        .top-cards {
          grid-template-columns: 1fr 1fr;
        }

        .stat-card {
          padding: 2.5rem;
          border-radius: 1.5rem;
          color: white;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        .stat-card::after {
          content: '';
          position: absolute;
          top: -50%; right: -20%;
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          filter: blur(20px);
        }

        .primary-gradient { background: linear-gradient(135deg, #2563eb, #1e3a8a); }
        .secondary-gradient { background: linear-gradient(135deg, #10b981, #047857); }

        .stat-card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .stat-label {
          font-size: 1.1rem;
          font-weight: 600;
          opacity: 0.9;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stat-value {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .stat-subtext {
          font-size: 0.9rem;
          opacity: 0.8;
          font-weight: 500;
        }
        .stat-icon-large {
          background: rgba(255, 255, 255, 0.2);
          padding: 1.5rem;
          border-radius: 1.25rem;
          backdrop-filter: blur(4px);
        }

        /* Main Metrics */
        .main-metrics {
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
        }

        .metric-panel {
          padding: 0;
          border-radius: 1.5rem;
          box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
          background: white;
          height: 100%;
        }

        .panel-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #f1f5f9;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .panel-icon {
          padding: 0.6rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .panel-body {
          padding: 1.5rem 2rem;
          flex-grow: 1;
          max-height: 500px;
          overflow-y: auto;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }

        /* Product List */
        .product-stat-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem;
          border-radius: 1rem;
          background: #f8fafc;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .product-stat-item:hover {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 4px 12px -5px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .product-stat-rank {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: white;
          color: var(--color-primary);
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
        }

        .product-stat-img {
          width: 56px; height: 56px;
          border-radius: 0.5rem;
          object-fit: cover;
          background: white;
          padding: 0.25rem;
        }

        .product-stat-info {
          flex-grow: 1;
        }
        .product-stat-info h4 {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }
        .product-stat-info p {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .product-stat-count {
          display: flex; flex-direction: column; align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          min-width: 70px;
        }

        /* Users Table Desktop */
        .desktop-table {
          display: block;
        }
        .users-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.5rem;
        }
        .users-table th {
          text-transform: uppercase;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          padding: 0.5rem 1rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .users-table td {
          padding: 1rem;
          background: #f8fafc;
        }
        .users-table tr td:first-child { border-radius: 0.75rem 0 0 0.75rem; }
        .users-table tr td:last-child { border-radius: 0 0.75rem 0.75rem 0; }
        
        .user-avatar-sm {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
        }

        /* Mobile Users Cards */
        .mobile-user-cards {
          display: none;
        }
        .mobile-user-card {
          background: white;
          padding: 1.25rem;
          border-radius: 1rem;
          background: #f8fafc;
        }
        .mobile-user-details {
          display: flex; flex-direction: column; gap: 0.5rem;
          background: white;
          padding: 1rem;
          border-radius: 0.75rem;
        }
        .detail-item {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.95rem;
          color: #475569;
          font-weight: 500;
        }

        .empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 3rem 1rem; text-align: center; color: #94a3b8; font-weight: 600;
        }

        /* ==================================
           RESPONSIVE MOBILE STYLES (Ultra Spacious)
           ================================== */
        @media (max-width: 1024px) {
          .main-metrics {
            grid-template-columns: 1fr; /* Stack panels */
          }
        }
        
        @media (max-width: 768px) {
          .stats-header {
            flex-direction: column;
            align-items: stretch;
            padding: 1.5rem;
            gap: 1.5rem;
          }
          .filter-wrapper {
            align-items: stretch;
          }
          .custom-select {
            width: 100%;
          }
          
          .top-cards {
            grid-template-columns: 1fr; /* Stack main stat cards */
          }
          .stat-card {
            padding: 2rem;
          }
          .stat-value {
            font-size: 3rem;
          }

          .panel-body {
            padding: 1rem; /* More space around list */
          }

          .desktop-table {
            display: none; /* Hide standard table on mobile */
          }
          .mobile-user-cards {
            display: flex; /* Show stacked cards on mobile */
          }
          
          .product-stat-item {
            flex-wrap: wrap; /* Let elements wrap on very small screens */
            position: relative;
            padding: 1.25rem;
          }
          .product-stat-info {
            width: calc(100% - 90px);
          }
          .product-stat-count {
            position: absolute;
            top: -10px;
            right: 10px;
            background: #10b981;
            color: white;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4);
            transform: scale(0.85);
          }
          .product-stat-count span.text-xs { color: rgba(255,255,255,0.9); }
        }
      `}</style>
    </>
  );
}
