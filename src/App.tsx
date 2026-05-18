import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { ForumPage } from './pages/ForumPage';
import { ChatPage } from './pages/ChatPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { SimulationPage } from './pages/SimulationPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

interface User {
  username: string;
  email: string;
  id: string;
  _id: string;
}

function App() {
  const [currentNav, setCurrentNav] = useState('home');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingUsername, setViewingUsername] = useState<string | null>(null);

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser({
            username: data.user.username,
            email: data.user.email,
            id: data.user._id,
            _id: data.user._id,
          });
        }
      })
      .catch((err) => {
        console.error('获取用户失败:', err);

        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleNavigate = (page: string) => {
    if (page.startsWith('profile/')) {
      const parts = page.split('/');
      if (parts.length >= 3) {
        setViewingUserId(parts[1]);
        setViewingUsername(parts[2]);
        setCurrentNav('profile');
      }
    } else {
      setViewingUserId(null);
      setViewingUsername(null);
      setCurrentNav(page);
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);

    setCurrentNav('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    setCurrentUser(null);

    setCurrentNav('home');
  };

  const renderPage = () => {
    switch (currentNav) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
          />
        );

      case 'forum':
        return (
          <ForumPage
            onNavigate={handleNavigate}
            currentUser={currentUser!}
          />
        );

      case 'chat':
        return (
          <ChatPage
            onNavigate={handleNavigate}
            currentUser={currentUser!}
          />
        );

      case 'resources':
        return (
          <ResourcesPage
            onNavigate={handleNavigate}
          />
        );

      case 'simulation':
        return (
          <SimulationPage
            onNavigate={handleNavigate}
          />
        );

      case 'profile':
        return (
          <ProfilePage
            onNavigate={handleNavigate}
            currentUser={currentUser!}
            viewingUserId={viewingUserId}
            viewingUsername={viewingUsername}
          />
        );

      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
          />
        );
    }
  };

  // 加载中
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />

        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            color: '#6b7280',
            background:
              'linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)',
          }}
        >
          加载中...
        </div>
      </ThemeProvider>
    );
  }

  // 未登录
  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />

        <AuthPage
          onLogin={handleLogin}
        />
      </ThemeProvider>
    );
  }

  // 已登录
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <Header
        currentUser={currentUser}
        onNavChange={handleNavigate}
        currentNav={currentNav}
        onLogout={handleLogout}
      />

      <main>
        {renderPage()}
      </main>

      <Footer
        onNavChange={handleNavigate}
      />
    </ThemeProvider>
  );
}

export default App;