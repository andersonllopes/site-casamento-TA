import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import GalleryPage from './pages/GalleryPage';
import GiftsPage from './pages/GiftsPage';
import RSVPPage from './pages/RSVPPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'story':
        return <StoryPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'gifts':
        return <GiftsPage />;
      case 'rsvp':
        return <RSVPPage />;
      case 'messages':
        return <MessagesPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderPage()}</main>
      <footer className="bg-rose-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-serif text-2xl mb-2">Thais & Anderson</p>
          <p className="text-rose-200 text-sm">21 de Dezembro, 2025</p>
          <p className="text-rose-300 text-xs mt-4">
            &copy; 2025 - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
