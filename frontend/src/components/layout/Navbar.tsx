import React, { useState } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  Home,
  QrCode,
  Box,
  Shield,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "../../types";
import LogoutModal from "../../pages/shared/LogoutModal.tsx";
import { logoutUser } from "../../services/authService";

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleLogoutConfirmation = () =>
    setShowLogoutConfirm(!showLogoutConfirm);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Box className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold">AgriChain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-neutral-700 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/products"
              className="text-neutral-700 hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              to="/verify"
              className="text-neutral-700 hover:text-primary transition-colors"
            >
              Verify
            </Link>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Search className="h-5 w-5 text-neutral-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Bell className="h-5 w-5 text-neutral-600" />
            </button>

            {/* Profile dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 justify-items-stretch animate-fade-in">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-neutral-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={toggleLogoutConfirmation}
                      className="flex items-center px-4 py-2 text-sm text-error hover:bg-neutral-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
                {showLogoutConfirm && (
                  <LogoutModal
                    onConfirm={handleLogout}
                    onCancel={toggleLogoutConfirmation}
                  />
                )}
              </div>
            ) : (
              <Link to="/" className="btn btn-primary">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
            >
              <div className="flex items-center">
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
            >
              <div className="flex items-center">
                <Box className="mr-3 h-5 w-5" />
                Products
              </div>
            </Link>
            <Link
              to="/verify"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
            >
              <div className="flex items-center">
                <QrCode className="mr-3 h-5 w-5" />
                Verify
              </div>
            </Link>
            <Link
              to="/certificates"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
            >
              <div className="flex items-center">
                <Shield className="mr-3 h-5 w-5" />
                Certificates
              </div>
            </Link>
          </div>
          {user ? (
            <div className="pt-4 pb-3 border-t border-neutral-200">
              <div className="flex items-center px-5">
                <div className="bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{user.name}</div>
                  <div className="text-sm text-neutral-500 capitalize">
                    {user.role}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                >
                  <div className="flex items-center">
                    <UserIcon className="mr-3 h-5 w-5" />
                    Profile
                  </div>
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                >
                  <div className="flex items-center">
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </div>
                </Link>
                <button
                  onClick={toggleLogoutConfirmation}
                  className="block px-3 py-2 rounded-md text-base font-medium text-error hover:bg-neutral-100"
                >
                  Sign out
                </button>
              </div>
              {showLogoutConfirm && (
                <LogoutModal
                  onConfirm={handleLogout}
                  onCancel={toggleLogoutConfirmation}
                />
              )}
            </div>
          ) : (
            <div className="px-5 py-3 border-t border-neutral-200">
              <Link to="/login" className="btn btn-primary w-full">
                Sign in
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
