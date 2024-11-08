import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export const AuthButton: React.FC = () => {
  const { user, signInWithGoogle, signInWithReddit, signOut } = useAuthStore();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={user.photoURL || ''}
          alt={user.displayName || 'User'}
          className="w-8 h-8 rounded-full"
        />
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="w-4 h-4"
        />
        Sign in with Google
      </button>
      <button
        onClick={signInWithReddit}
        className="flex items-center gap-2 px-4 py-2 bg-[#FF4500] text-white rounded-lg hover:bg-[#FF5722] transition-colors"
      >
        <img
          src="https://www.reddit.com/favicon.ico"
          alt="Reddit"
          className="w-4 h-4"
        />
        Sign in with Reddit
      </button>
    </div>
  );
};