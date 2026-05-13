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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser({
            username: data.user.username,
            email: data.user.email,
            id: data.user._id,
            _id: data.user._id
          });
        }
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentNav('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentNav('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentNav(page);
  };

  const renderPage = () => {
    switch (currentNav) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'forum':
        return <ForumPage onNavigate={handleNavigate} currentUser={currentUser!} />;
      case 'chat':
        return <ChatPage onNavigate={handleNavigate} currentUser={currentUser!} />;
      case 'resources':
        return <ResourcesPage onNavigate={handleNavigate} />;
      case 'simulation':
        return <SimulationPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} currentUser={currentUser!} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>加载中...</div>
        </div>
      </ThemeProvider>
    );
  }

  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

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
      <Footer />
    </ThemeProvider>
  );
}

export default App;