import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-700' : '';
  };

  return (
    <nav className="bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Finance Tracker
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/transactions"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/transactions')}`}
                >
                  Transactions
                </Link>
                <Link
                  to="/budget"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/budget')}`}
                >
                  Budget
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive('/transactions')}`}
          >
            Transactions
          </Link>
          <Link
            to="/budget"
            className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive('/budget')}`}
          >
            Budget
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
