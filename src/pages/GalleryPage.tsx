import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Album {
  title: string;
  count: number;
  cover: string;
  photos: string[];
}

export default function GalleryPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega as fotos automaticamente usando import.meta.glob (Vite)
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // Importa todas as fotos da pasta photos
        const photoModules = import.meta.glob('../photos/T_A-*.{jpg,jpeg,png}', { 
          eager: true,
          query: '?url'
        });

        // Converte para array e ordena numericamente
        const photoPaths = Object.entries(photoModules)
          .map(([path, module]: [string, any]) => ({
            path,
            url: module.default,
            number: parseInt(path.match(/T_A-(\d+)/)?.[1] || '0')
          }))
          .sort((a, b) => a.number - b.number)
          .map(item => item.url);

        // Cria álbuns automaticamente
        const PHOTOS_PER_ALBUM = 100;
        const loadedAlbums: Album[] = [];

        if (photoPaths.length === 0) {
          // Fallback caso não encontre fotos
          loadedAlbums.push({
            title: 'PRE WEDDING',
            count: 0,
            cover: '/placeholder.jpg',
            photos: []
          });
        } else {
          for (let i = 0; i < photoPaths.length; i += PHOTOS_PER_ALBUM) {
            const albumPhotos = photoPaths.slice(i, i + PHOTOS_PER_ALBUM);
            const albumNumber = Math.floor(i / PHOTOS_PER_ALBUM) + 1;
            
            loadedAlbums.push({
              title: albumPhotos.length > 1 ? `PRE WEDDING - Sessão ${albumNumber}` : 'PRE WEDDING',
              count: albumPhotos.length,
              cover: albumPhotos[0],
              photos: albumPhotos
            });
          }
        }

        setAlbums(loadedAlbums);
      } catch (error) {
        console.error('Erro ao carregar fotos:', error);
        // Fallback manual com algumas fotos
        setAlbums([{
          title: 'PRE WEDDING',
          count: 13,
          cover: '/placeholder.jpg',
          photos: []
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const openLightbox = (album: Album, index: number) => {
    setSelectedAlbum(album);
    setCurrentPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (selectedAlbum) {
      setCurrentPhotoIndex((prev) =>
        prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedAlbum) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
      );
    }
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlbum]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rose-50 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-rose-900 text-lg">Carregando galeria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-rose-600 text-sm uppercase tracking-wide mb-2">Nossas Memórias</p>
          <h1 className="font-serif text-5xl text-rose-900 mb-4">Galeria do Casamento</h1>
          <p className="text-gray-600 text-lg">
            {albums.reduce((total, album) => total + album.count, 0)} momentos especiais capturados
          </p>
        </div>

        {/* Cards dos Álbuns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {albums.map((album, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer bg-white"
              onClick={() => openLightbox(album, 0)}
            >
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm bg-rose-600 px-2 py-1 rounded">
                      {album.count} {album.count === 1 ? 'foto' : 'fotos'}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl">{album.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid de Fotos de Cada Álbum */}
        {albums.map((album, albumIndex) => (
          <div key={albumIndex} className="mt-16">
            <h2 className="font-serif text-3xl text-rose-900 mb-6 border-b border-rose-200 pb-2">
              {album.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {album.photos.map((photo, photoIndex) => (
                <div
                  key={photoIndex}
                  className="relative overflow-hidden rounded-lg shadow cursor-pointer group aspect-square"
                  onClick={() => openLightbox(album, photoIndex)}
                >
                  <img
                    src={photo}
                    alt={`${album.title} ${photoIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm bg-black/50 px-2 py-1 rounded">
                      Ver foto
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-2 z-10"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-2 z-10"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl max-h-full text-center">
            <img
              src={selectedAlbum.photos[currentPhotoIndex]}
              alt={`${selectedAlbum.title} ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain mx-auto"
            />
            <p className="text-white text-center mt-4 text-lg">
              {currentPhotoIndex + 1} / {selectedAlbum.photos.length} - {selectedAlbum.title}
            </p>
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-2 z-10"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  );
}