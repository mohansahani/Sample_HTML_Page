import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bg-white border-b mb-4">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">ITAM Portal</span>
          <Link className={`hover:underline ${pathname === '/dashboard' ? 'underline' : ''}`} to="/dashboard">Dashboard</Link>
          <Link className={`hover:underline ${pathname === '/assets' ? 'underline' : ''}`} to="/assets">Assets</Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.name} ({user?.role})</span>
          <button className="btn btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}