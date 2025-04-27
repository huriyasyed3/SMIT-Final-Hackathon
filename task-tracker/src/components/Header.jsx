import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard')}>
        Task Tracker
      </h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.username}</span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
