import { useState } from 'react';
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

  const albums: Album[] = [
    {
      title: 'Nosso Namoro',
      count: 12,
      cover: 'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024970/pexels-photo-1024970.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024973/pexels-photo-1024973.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/733500/pexels-photo-733500.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024972/pexels-photo-1024972.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024974/pexels-photo-1024974.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024968/pexels-photo-1024968.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024966/pexels-photo-1024966.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024969/pexels-photo-1024969.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1024971/pexels-photo-1024971.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ]
    },
    {
      title: 'Nosso Noivado',
      count: 12,
      cover: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
      photos: [
        'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/265705/pexels-photo-265705.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/265857/pexels-photo-265857.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/265872/pexels-photo-265872.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/433452/pexels-photo-433452.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2072179/pexels-photo-2072179.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2072183/pexels-photo-2072183.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2072180/pexels-photo-2072180.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ]
    }
  ];

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

  return (
    <div className="min-h-screen bg-rose-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-rose-600 text-sm uppercase tracking-wide mb-2">Nossas Memórias</p>
          <h1 className="font-serif text-5xl text-rose-900 mb-4">Galeria do Casamento</h1>
          <p className="text-gray-600 text-lg">Cada imagem desta galeria conta um pedaço da nossa história...</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {albums.map((album, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
                onClick={() => openLightbox(album, 0)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-sm mb-1">{album.count} Photos</p>
                  <h3 className="font-serif text-2xl">{album.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {albums.map((album, albumIndex) => (
          <div key={albumIndex} className="mt-16">
            <h2 className="font-serif text-3xl text-rose-900 mb-6">{album.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {album.photos.map((photo, photoIndex) => (
                <div
                  key={photoIndex}
                  className="relative overflow-hidden rounded-lg shadow cursor-pointer group"
                  onClick={() => openLightbox(album, photoIndex)}
                >
                  <img
                    src={photo}
                    alt={`${album.title} ${photoIndex + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-rose-300 transition-colors"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 text-white hover:text-rose-300 transition-colors"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl max-h-full">
            <img
              src={selectedAlbum.photos[currentPhotoIndex]}
              alt={`${selectedAlbum.title} ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
            <p className="text-white text-center mt-4">
              {currentPhotoIndex + 1} / {selectedAlbum.photos.length}
            </p>
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 text-white hover:text-rose-300 transition-colors"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  );
}
