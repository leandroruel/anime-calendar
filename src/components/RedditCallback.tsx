import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const RedditCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedditCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const savedState = sessionStorage.getItem('redditAuthState');

      if (!code || !state || state !== savedState) {
        navigate('/');
        return;
      }

      try {
        // In a real application, you would:
        // 1. Send the code to your backend
        // 2. Backend exchanges code for Reddit access token
        // 3. Backend creates a custom Firebase token
        // 4. Frontend signs in with the custom token
        const response = await fetch('/api/auth/reddit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const { firebaseToken } = await response.json();
        await signInWithCustomToken(auth, firebaseToken);
        navigate('/');
      } catch (error) {
        console.error('Reddit authentication error:', error);
        navigate('/');
      }
    };

    handleRedditCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};