import { useState, useEffect, useRef } from 'react';
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

  // Carrega as fotos automaticamente usando import.meta.glob (Vite)
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // Importa fotos de diferentes categorias
        const photoModules = {
          prewedding: import.meta.glob('../photos/prewedding/T_A-*.{jpg,jpeg,png}', { 
            eager: true,
            query: '?url'
          }),
          noivado: import.meta.glob('../photos/noivado/*.{jpg,jpeg,png}', { 
            eager: true,
            query: '?url'
          }),
          namoro: import.meta.glob('../photos/namoro/*.{jpg,jpeg,png}', { 
            eager: true,
            query: '?url'
          })
        };

        // CORREÇÃO: Importação do vídeo mais robusta
        let noivadoVideo = '';
        try {
          // Tenta importar o vídeo
          const videoModules = import.meta.glob('../photos/noivado/*.mp4', { 
            eager: true,
            query: '?url'
          });
          noivadoVideo = Object.values(videoModules)[0]?.default || '';
        } catch (videoError) {
          console.log('Vídeo não encontrado na importação automática');
        }

        // Fallback para desenvolvimento
        if (!noivadoVideo) {
          noivadoVideo = '/photos/noivado/pedido.mp4';
        }

        const loadedAlbums: Album[] = [];

        // Álbum Pre-Wedding
        const preWeddingPhotos = Object.entries(photoModules.prewedding)
          .map(([path, module]: [string, any]) => ({
            path,
            url: module.default,
            number: parseInt(path.match(/T_A-(\d+)/)?.[1] || '0')
          }))
          .sort((a, b) => a.number - b.number)
          .map(item => item.url);

        if (preWeddingPhotos.length > 0) {
          const PHOTOS_PER_ALBUM = 100;
          for (let i = 0; i < preWeddingPhotos.length; i += PHOTOS_PER_ALBUM) {
            const albumPhotos = preWeddingPhotos.slice(i, i + PHOTOS_PER_ALBUM);
            
            loadedAlbums.push({
              title: 'Ensaio Pré-Wedding',
              subtitle: albumPhotos.length > 1 ? `Sessão Romântica` : 'Nosso Ensaio',
              count: albumPhotos.length,
              cover: albumPhotos[0],
              photos: albumPhotos,
              category: 'prewedding'
            });
          }
        }

        // Álbum Noivado com vídeo
        const noivadoPhotos = Object.entries(photoModules.noivado)
          .map(([path, module]: [string, any]) => ({
            url: module.default
          }))
          .map(item => item.url);

        if (noivadoPhotos.length > 0 || noivadoVideo) {
          loadedAlbums.push({
            title: 'Tempo de Espera e Sonhos',
            subtitle: 'Nossa Fase de Noivado',
            count: noivadoPhotos.length + (noivadoVideo ? 1 : 0),
            cover: noivadoPhotos[0] || '/placeholder.jpg',
            photos: noivadoPhotos,
            video: noivadoVideo,
            category: 'noivado'
          });
        }

        // Álbum Namoro
        const namoroPhotos = Object.entries(photoModules.namoro)
          .map(([path, module]: [string, any]) => ({
            url: module.default
          }))
          .map(item => item.url);

        if (namoroPhotos.length > 0) {
          loadedAlbums.push({
            title: 'Nossos Primeiros Passos',
            subtitle: 'O Início da Nossa Jornada',
            count: namoroPhotos.length,
            cover: namoroPhotos[0],
            photos: namoroPhotos,
            category: 'namoro'
          });
        }

        // Fallback caso não encontre fotos
        if (loadedAlbums.length === 0) {
          loadedAlbums.push({
            title: 'Nossa História de Amor',
            subtitle: 'Memórias que Guardaremos para Sempre',
            count: 0,
            cover: '/placeholder.jpg',
            photos: [],
            category: 'prewedding'
          });
        }

        setAlbums(loadedAlbums);
      } catch (error) {
        console.error('Erro ao carregar fotos:', error);
        // Fallback manual
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
  }, []);

  const handleImageLoad = (imageKey: string) => {
    setLoadedImages(prev => ({ ...prev, [imageKey]: true }));
  };

  // Funções do vídeo
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('Erro ao reproduzir vídeo:', error);
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setCurrentTime(0);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Formatar tempo
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const categories = [
    { id: 'todos', name: 'Todos os Momentos' },
    { id: 'namoro', name: 'Namoro' },
    { id: 'noivado', name: 'Noivado' },
    { id: 'prewedding', name: 'Pré-Wedding' }
  ];

  const filteredAlbums = activeCategory === 'todos' 
    ? albums 
    : albums.filter(album => album.category === activeCategory);

  // CORREÇÃO: Funções de abertura simplificadas e diretas
  const openLightbox = (album: Album, index: number) => {
    console.log('Abrindo lightbox para foto:', index);
    setSelectedAlbum(album);
    setCurrentIndex(index);
    setIsVideoPlaying(false);
    setCurrentTime(0);
  };

  // CORREÇÃO: Função específica para abrir vídeo
  const openVideo = (album: Album) => {
    console.log('Abrindo vídeo para álbum:', album.title);
    setSelectedAlbum(album);
    setCurrentIndex(-1); // -1 indica modo vídeo
    setIsVideoPlaying(true);
    setCurrentTime(0);
  };

  const closeLightbox = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedAlbum(null);
    setCurrentIndex(0);
    setIsVideoPlaying(false);
    setIsVideoMuted(true);
    setCurrentTime(0);
  };

  // Navegação
  const nextMedia = () => {
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
  };

  const prevMedia = () => {
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
  };

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
  }, [selectedAlbum, isVideoPlaying, currentIndex]);

  // Controlar reprodução do vídeo
  useEffect(() => {
    if (videoRef.current && selectedAlbum?.video && isVideoPlaying) {
      videoRef.current.play().catch(error => {
        console.error('Erro ao reproduzir vídeo:', error);
        setIsVideoPlaying(false);
      });
    }
  }, [isVideoPlaying, selectedAlbum]);

  // Componente de imagem com loading
  const ImageWithLoader = ({ 
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600 mb-2"></div>
              <p className="text-gray-500 text-xs">Carregando...</p>
            </div>
          </div>
        )}
        
        <img
          src={src}
          alt={alt}
          className={`${className} transition-all duration-500 ${
            isLoaded 
              ? 'opacity-100 transform scale-100' 
              : 'opacity-0 transform scale-95'
          }`}
          onLoad={() => handleImageLoad(imageKey)}
          onClick={onClick}
          loading="lazy"
        />
      </div>
    );
  };

  // CORREÇÃO: Componente para o card de vídeo - SIMPLIFICADO E FUNCIONAL
  const VideoCard = ({ album }: { album: Album }) => {
    // CORREÇÃO: Função direta sem complicações
    const handleVideoClick = () => {
      console.log('Clicou no card de vídeo');
      openVideo(album);
    };

    return (
      <div
        className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group aspect-square bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 transition-all duration-300"
        onClick={handleVideoClick}
      >
        <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 text-center">
          <div className="bg-white/20 rounded-full p-4 mb-3 transform group-hover:scale-110 transition-transform duration-300">
            <Play size={32} className="ml-1" fill="white" />
          </div>
          <p className="font-semibold text-lg mb-1">Vídeo Especial</p>
          <p className="text-sm opacity-90">1 Minuto</p>
        </div>
        
        {/* Badge de vídeo */}
        <div className="absolute top-3 right-3 bg-white/90 text-rose-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
          <Play size={10} />
          Vídeo
        </div>

        {/* Efeito de hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl transition-all duration-300" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rose-50 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-rose-900 text-lg">Carregando nossas memórias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-rose-600 text-sm uppercase tracking-wide mb-2">Nossa Jornada</p>
          <h1 className="font-serif text-5xl text-rose-900 mb-4">Linha do Tempo do Amor</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cada fotografia conta uma parte da nossa história, desde os primeiros sorrisos 
            até o momento em que decidimos passar a vida inteira juntos.
          </p>
        </div>

        {/* Filtros por Categoria */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white text-rose-900 hover:bg-rose-100 shadow'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Cards dos Álbuns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredAlbums.map((album, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer bg-white transform transition-transform duration-300 hover:scale-105"
              onClick={() => openLightbox(album, 0)}
            >
              <ImageWithLoader
                src={album.cover}
                alt={album.title}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                imageKey={`album-cover-${index}`}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm bg-rose-600/90 px-3 py-1 rounded-full">
                      {album.count} {album.count === 1 ? 'memória' : 'memórias'}
                      {album.video && ' + vídeo'}
                    </span>
                    {album.video && (
                      <span className="text-xs bg-blue-600/90 px-2 py-1 rounded-full">
                        Tem vídeo!
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2">{album.title}</h3>
                  <p className="text-rose-200 text-sm">{album.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid de Fotos e Vídeos de Cada Álbum */}
        {filteredAlbums.map((album, albumIndex) => (
          <div key={albumIndex} className="mt-16 first:mt-0">
            <div className="text-center mb-8">
              <h2 className="font-serif text-4xl text-rose-900 mb-2">{album.title}</h2>
              <p className="text-gray-600 text-lg">{album.subtitle}</p>
              <div className="w-24 h-1 bg-rose-300 mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Fotos do Álbum PRIMEIRO */}
              {album.photos.map((photo, photoIndex) => (
                <div
                  key={photoIndex}
                  className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group aspect-square"
                  onClick={() => openLightbox(album, photoIndex)}
                >
                  <ImageWithLoader
                    src={photo}
                    alt={`${album.title} ${photoIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    imageKey={`album-${albumIndex}-photo-${photoIndex}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm bg-black/50 px-3 py-2 rounded-full">
                      Ver memória
                    </div>
                  </div>
                </div>
              ))}
              
              {/* CORREÇÃO: Card do Vídeo - AGORA DEVE FUNCIONAR! */}
              {album.video && (
                <VideoCard album={album} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-2 z-10"
          >
            <X size={32} />
          </button>

          {/* Controles de navegação */}
          <button
            onClick={prevMedia}
            className="absolute left-6 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-2 z-10"
          >
            <ChevronLeft size={48} />
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-6 text-white hover:text-rose-300 transition-colors bg-black/50 rounded-full p-2 z-10"
          >
            <ChevronRight size={48} />
          </button>

          <div className="max-w-5xl max-h-full text-center">
            {isVideoPlaying ? (
              // Player de Vídeo
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={selectedAlbum.video}
                  className="max-w-full max-h-[85vh] object-contain mx-auto"
                  onEnded={handleVideoEnd}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  playsInline
                  preload="auto"
                  muted={isVideoMuted}
                  controls={false}
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
                
                {/* Controles customizados */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={toggleVideoPlayback}
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-full p-3 transition-colors"
                    >
                      {isVideoPlaying ? <Pause size={24} /> : <Play size={24} fill="white" />}
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      {isVideoMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    
                    <div className="text-white text-sm bg-black/50 px-3 py-1 rounded font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Visualizador de Fotos
              <div className="relative">
                {selectedAlbum.photos.length > 0 && !loadedImages[`lightbox-${currentIndex}`] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mb-4"></div>
                      <p className="text-white text-lg">Carregando memória...</p>
                    </div>
                  </div>
                )}
                {selectedAlbum.photos.length > 0 && (
                  <img
                    src={selectedAlbum.photos[currentIndex]}
                    alt={`${selectedAlbum.title} ${currentIndex + 1}`}
                    className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg transition-opacity duration-300"
                    onLoad={() => handleImageLoad(`lightbox-${currentIndex}`)}
                  />
                )}
              </div>
            )}
            
            <div className="text-white text-center mt-6">
              <p className="text-xl font-serif">{selectedAlbum.title}</p>
              <p className="text-rose-200 mt-1">
                {isVideoPlaying 
                  ? 'Vídeo Especial - 1 Minuto de Pura Emoção' 
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