import { useState } from 'react';
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

function App() {
  const [currentNav, setCurrentNav] = useState('home');
  const [currentUser] = useState({ username: '晨曦' });

  const handleNavigate = (page: string) => {
    setCurrentNav(page);
  };

  const renderPage = () => {
    switch (currentNav) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'forum':
        return <ForumPage onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatPage onNavigate={handleNavigate} />;
      case 'resources':
        return <ResourcesPage onNavigate={handleNavigate} />;
      case 'simulation':
        return <SimulationPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header 
        currentUser={currentUser} 
        onNavChange={handleNavigate} 
        currentNav={currentNav} 
      />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;