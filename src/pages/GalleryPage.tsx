import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Album {
  title: string;
  subtitle: string;
  count: number;
  cover: string;
  photos: string[];
  category: string;
  video?: string;
}

interface ImageLoadState {
  [key: string]: boolean;
}

// CORREÇÃO: Otimizações para mobile
export default function GalleryPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [loadedImages, setLoadedImages] = useState<ImageLoadState>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageQuality, setImageQuality] = useState<'low' | 'high'>('low');

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSlowConnection = navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g' || navigator.connection.effectiveType === '3g');

    setImageQuality((isMobile || isSlowConnection) ? 'low' : 'high');
  }, []);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);

        const photoModules = {
          prewedding: import.meta.glob('../photos/prewedding/T_A-*.{jpg,jpeg,png}', {
            eager: false,
            import: 'default'
          }),
          noivado: import.meta.glob('../photos/noivado/*.{jpg,jpeg,png}', {
            eager: false,
            import: 'default'
          }),
          namoro: import.meta.glob('../photos/namoro/*.{jpg,jpeg,png}', {
            eager: false,
            import: 'default'
          })
        };

        let noivadoVideo = '';
        try {
          const videoModules = import.meta.glob('../photos/noivado/*.mp4', {
            eager: false,
            import: 'default'
          });
          const videoKeys = Object.keys(videoModules);
          if (videoKeys.length > 0) {
            noivadoVideo = await videoModules[videoKeys[0]]();
          }
        } catch (videoError) {
          console.log('Vídeo não encontrado');
        }

        const loadedAlbums: Album[] = [];

        const preWeddingEntries = Object.entries(photoModules.prewedding)
          .map(([path, loader]) => ({
            path,
            loader,
            number: parseInt(path.match(/T_A-(\d+)/)?.[1] || '0')
          }))
          .sort((a, b) => a.number - b.number);

        const limitPreWedding = imageQuality === 'low' ? 15 : 30;
        const preWeddingToLoad = preWeddingEntries.slice(0, limitPreWedding);
        const preWeddingPhotos = await Promise.all(
          preWeddingToLoad.map(item => item.loader())
        );

        if (preWeddingPhotos.length > 0) {
          loadedAlbums.push({
            title: 'Ensaio Pré-Wedding',
            subtitle: 'Sessão Romântica',
            count: preWeddingEntries.length,
            cover: preWeddingPhotos[0],
            photos: preWeddingPhotos,
            category: 'prewedding'
          });
        }

        const noivadoEntries = Object.entries(photoModules.noivado);
        const limitNoivado = imageQuality === 'low' ? 8 : 12;
        const noivadoToLoad = noivadoEntries.slice(0, limitNoivado);
        const noivadoPhotos = await Promise.all(
          noivadoToLoad.map(([_, loader]) => loader())
        );

        if (noivadoPhotos.length > 0 || noivadoVideo) {
          loadedAlbums.push({
            title: 'Tempo de Espera e Sonhos',
            subtitle: 'Nossa Fase de Noivado',
            count: noivadoEntries.length + (noivadoVideo ? 1 : 0),
            cover: noivadoPhotos[0] || '/placeholder.jpg',
            photos: noivadoPhotos,
            video: noivadoVideo,
            category: 'noivado'
          });
        }

        const namoroEntries = Object.entries(photoModules.namoro);
        const limitNamoro = imageQuality === 'low' ? 8 : 12;
        const namoroToLoad = namoroEntries.slice(0, limitNamoro);
        const namoroPhotos = await Promise.all(
          namoroToLoad.map(([_, loader]) => loader())
        );

        if (namoroPhotos.length > 0) {
          loadedAlbums.push({
            title: 'Nossos Primeiros Passos',
            subtitle: 'O Início da Nossa Jornada',
            count: namoroEntries.length,
            cover: namoroPhotos[0],
            photos: namoroPhotos,
            category: 'namoro'
          });
        }

        setAlbums(loadedAlbums);
      } catch (error) {
        console.error('Erro ao carregar fotos:', error);
        setAlbums([
          {
            title: 'Tempo de Espera e Sonhos',
            subtitle: 'Nossa Fase de Noivado',
            count: 8,
            cover: '/placeholder.jpg',
            photos: Array(8).fill('/placeholder.jpg'),
            video: '/photos/noivado/pedido.mp4',
            category: 'noivado'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, [imageQuality]);

  // CORREÇÃO: useCallback para evitar re-renders desnecessários
  const handleImageLoad = useCallback((imageKey: string) => {
    setLoadedImages(prev => ({ ...prev, [imageKey]: true }));
  }, []);

  const toggleVideoPlayback = useCallback(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('Erro ao reproduzir vídeo:', error);
        });
      }
    }
  }, [isVideoPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(!isVideoMuted);
    }
  }, [isVideoMuted]);

  const handleVideoEnd = useCallback(() => {
    setIsVideoPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  const handleVideoPause = useCallback(() => {
    setIsVideoPlaying(false);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const categories = [
    { id: 'todos', name: 'Todos os Momentos' },
    { id: 'namoro', name: 'Namoro' },
    { id: 'noivado', name: 'Noivado' },
    { id: 'prewedding', name: 'Pré-Wedding' }
  ];

  const filteredAlbums = activeCategory === 'todos' 
    ? albums 
    : albums.filter(album => album.category === activeCategory);

  // CORREÇÃO: Funções memoizadas
  const openLightbox = useCallback((album: Album, index: number) => {
    setSelectedAlbum(album);
    setCurrentIndex(index);
    setIsVideoPlaying(false);
    setCurrentTime(0);
  }, []);

  const openVideo = useCallback((album: Album) => {
    setSelectedAlbum(album);
    setCurrentIndex(-1);
    setIsVideoPlaying(true);
    setCurrentTime(0);
  }, []);

  const closeLightbox = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedAlbum(null);
    setCurrentIndex(0);
    setIsVideoPlaying(false);
    setIsVideoMuted(true);
    setCurrentTime(0);
  }, []);

  const nextMedia = useCallback(() => {
    if (!selectedAlbum) return;

    const totalPhotos = selectedAlbum.photos.length;
    const hasVideo = !!selectedAlbum.video;

    if (isVideoPlaying) {
      setIsVideoPlaying(false);
      setCurrentIndex(0);
    } else if (currentIndex === totalPhotos - 1) {
      if (hasVideo) {
        setIsVideoPlaying(true);
        setCurrentTime(0);
      } else {
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [selectedAlbum, isVideoPlaying, currentIndex]);

  const prevMedia = useCallback(() => {
    if (!selectedAlbum) return;

    const totalPhotos = selectedAlbum.photos.length;
    const hasVideo = !!selectedAlbum.video;

    if (isVideoPlaying) {
      setIsVideoPlaying(false);
      setCurrentIndex(totalPhotos - 1);
    } else if (currentIndex === 0) {
      if (hasVideo) {
        setIsVideoPlaying(true);
        setCurrentTime(0);
      } else {
        setCurrentIndex(totalPhotos - 1);
      }
    } else {
      setCurrentIndex(prev => prev - 1);
    }
  }, [selectedAlbum, isVideoPlaying, currentIndex]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
      if (e.key === ' ' && selectedAlbum.video) {
        e.preventDefault();
        toggleVideoPlayback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlbum, isVideoPlaying, currentIndex, closeLightbox, nextMedia, prevMedia, toggleVideoPlayback]);

  // Controlar reprodução do vídeo
  useEffect(() => {
    if (videoRef.current && selectedAlbum?.video && isVideoPlaying) {
      videoRef.current.play().catch(error => {
        console.error('Erro ao reproduzir vídeo:', error);
        setIsVideoPlaying(false);
      });
    }
  }, [isVideoPlaying, selectedAlbum]);

  // CORREÇÃO: Componente de imagem otimizado para mobile
  const ImageWithLoader = useCallback(({ 
    src, 
    alt, 
    className, 
    imageKey,
    onClick 
  }: { 
    src: string; 
    alt: string; 
    className: string; 
    imageKey: string;
    onClick?: () => void;
  }) => {
    const isLoaded = loadedImages[imageKey];

    return (
      <div className="relative overflow-hidden">
        {!isLoaded && (
          <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-600 mb-1"></div>
              <p className="text-gray-500 text-xs">Carregando...</p>
            </div>
          </div>
        )}
        
        <img
          src={src}
          alt={alt}
          className={`${className} transition-all duration-300 ${
            isLoaded
              ? 'opacity-100 transform scale-100'
              : 'opacity-0 transform scale-95'
          }`}
          onLoad={() => handleImageLoad(imageKey)}
          onClick={onClick}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          style={{
            contentVisibility: 'auto',
            contain: 'paint'
          }}
        />
      </div>
    );
  }, [loadedImages, handleImageLoad]);

  // CORREÇÃO: VideoCard otimizado
  const VideoCard = useCallback(({ album }: { album: Album }) => {
    const handleVideoClick = useCallback(() => {
      openVideo(album);
    }, [album, openVideo]);

    return (
      <div
        className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group aspect-square bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 transition-all duration-300 active:scale-95"
        onClick={handleVideoClick}
      >
        <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 text-center">
          <div className="bg-white/20 rounded-full p-3 mb-2 transform group-hover:scale-110 transition-transform duration-300">
            <Play size={24} className="ml-0.5" fill="white" />
          </div>
          <p className="font-semibold text-base mb-1">Vídeo Especial</p>
          <p className="text-xs opacity-90">1 Minuto</p>
        </div>
        
        <div className="absolute top-2 right-2 bg-white/90 text-rose-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
          <Play size={8} />
          Vídeo
        </div>
      </div>
    );
  }, [openVideo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rose-50 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-rose-900 text-lg">Carregando nossas memórias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-3">
        <div className="text-center mb-8">
          <p className="text-rose-600 text-sm uppercase tracking-wide mb-2">Nossa Jornada</p>
          <h1 className="font-serif text-3xl md:text-5xl text-rose-900 mb-4">Linha do Tempo do Amor</h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
            Cada fotografia conta uma parte da nossa história, desde os primeiros sorrisos 
            até o momento em que decidimos passar a vida inteira juntos.
          </p>
        </div>

        {/* Filtros por Categoria - CORREÇÃO: Melhor para mobile */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white text-rose-900 hover:bg-rose-100 shadow'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Cards dos Álbuns - CORREÇÃO: Grid responsivo melhorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAlbums.map((album, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer bg-white transform transition-transform duration-300 hover:scale-105"
              onClick={() => openLightbox(album, 0)}
            >
              <ImageWithLoader
                src={album.cover}
                alt={album.title}
                className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                imageKey={`album-cover-${index}`}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                <div className="p-4 md:p-6 text-white w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-rose-600/90 px-2 py-1 rounded-full">
                      {album.count} {album.count === 1 ? 'memória' : 'memórias'}
                      {album.video && ' + vídeo'}
                    </span>
                    {album.video && (
                      <span className="text-xs bg-blue-600/90 px-2 py-1 rounded-full">
                        Tem vídeo!
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-1">{album.title}</h3>
                  <p className="text-rose-200 text-xs">{album.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid de Fotos e Vídeos - CORREÇÃO: Melhor performance mobile */}
        {filteredAlbums.map((album, albumIndex) => (
          <div key={albumIndex} className="mt-12 first:mt-0">
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl md:text-4xl text-rose-900 mb-2">{album.title}</h2>
              <p className="text-gray-600 text-base">{album.subtitle}</p>
              <div className="w-20 h-1 bg-rose-300 mx-auto mt-3"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {album.photos.map((photo, photoIndex) => (
                <div
                  key={photoIndex}
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group aspect-square"
                  onClick={() => openLightbox(album, photoIndex)}
                >
                  <ImageWithLoader
                    src={photo}
                    alt={`${album.title} ${photoIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    imageKey={`album-${albumIndex}-photo-${photoIndex}`}
                  />
                </div>
              ))}
              
              {album.video && (
                <VideoCard album={album} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox - CORREÇÃO: Otimizado para mobile */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 md:p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-2 z-10"
          >
            <X size={20} />
          </button>

          <button
            onClick={prevMedia}
            className="absolute left-2 md:left-6 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-1 md:p-2 z-10"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-2 md:right-6 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-1 md:p-2 z-10"
          >
            <ChevronRight size={24} />
          </button>

          <div className="max-w-full max-h-full text-center w-full">
            {isVideoPlaying ? (
              <div className="relative bg-black rounded-lg overflow-hidden w-full">
                <video
                  ref={videoRef}
                  src={selectedAlbum.video}
                  className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain mx-auto w-full"
                  onEnded={handleVideoEnd}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  playsInline
                  preload="metadata"
                  muted={isVideoMuted}
                  controls={false}
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23000' width='400' height='300'/%3E%3C/svg%3E"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-6">
                  <div className="flex items-center justify-center gap-2 md:gap-4">
                    <button
                      onClick={toggleVideoPlayback}
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-full p-2 md:p-3 transition-colors"
                    >
                      {isVideoPlaying ? <Pause size={16} /> : <Play size={16} fill="white" />}
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1 md:p-2 transition-colors"
                    >
                      {isVideoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    
                    <div className="text-white text-xs bg-black/50 px-2 py-1 rounded font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full">
                {selectedAlbum.photos.length > 0 && !loadedImages[`lightbox-${currentIndex}`] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mb-2"></div>
                      <p className="text-white text-sm">Carregando...</p>
                    </div>
                  </div>
                )}
                {selectedAlbum.photos.length > 0 && (
                  <img
                    src={selectedAlbum.photos[currentIndex]}
                    alt={`${selectedAlbum.title} ${currentIndex + 1}`}
                    className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain mx-auto rounded-lg transition-opacity duration-300 w-full"
                    onLoad={() => handleImageLoad(`lightbox-${currentIndex}`)}
                    loading="eager"
                    fetchPriority="high"
                  />
                )}
              </div>
            )}
            
            <div className="text-white text-center mt-4">
              <p className="text-lg md:text-xl font-serif">{selectedAlbum.title}</p>
              <p className="text-rose-200 text-sm mt-1">
                {isVideoPlaying 
                  ? 'Vídeo Especial - 1 Minuto' 
                  : `${currentIndex + 1} de ${selectedAlbum.photos.length} momentos${selectedAlbum.video ? ' + vídeo' : ''}`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}