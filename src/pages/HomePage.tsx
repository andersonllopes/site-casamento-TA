import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Heart, Calendar, MapPin } from 'lucide-react';
import Countdown from '../components/Countdown';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper.css';

import bgCover1 from '../photos/T_A-2.jpg';
import bgCover2 from '../photos/T_A-284.jpg';
import bgCover3 from '../photos/T_A-259.jpg';
import bgCover4 from '../photos/T_A-293.jpg';
import andersonPhoto from '../photos/rosto/T_A-137-V2.jpg';
import thaisPhoto from '../photos/rosto/T_A-80-V2.jpg';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const slides = [
  {
    image: bgCover1,
    title: 'Thais & Anderson',
    subtitle: '21 de Dezembro, 2025',
    position: 'center 80%' // padrão que já funciona
  },
  {
    image: bgCover2,
    title: 'Nosso Amor',
    subtitle: 'Vamos nos Casar!',
    position: 'center 38%' // ajuste conforme necessário
  },
  {
    image: bgCover3,
    title: 'Celebre Conosco',
    subtitle: 'São Paulo, BR',
    position: 'center 57%' // ajuste conforme necessário
  },
  {
    image: bgCover4,
    title: 'Thais & Anderson',
    subtitle: '21 de Dezembro, 2025',
    position: 'center 48%' // ajuste conforme necessário
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const preloadImages = [bgCover1, bgCover2, andersonPhoto, thaisPhoto];
    preloadImages.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
      };
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Seção Hero com Slideshow */}
      <section className="relative h-screen">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          speed={1000}
          autoplay={{ 
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ 
            clickable: true,
            el: '.swiper-pagination',
            type: 'bullets',
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onInit={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          className="h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-full bg-cover bg-center flex items-center justify-center relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
                  backgroundPosition: slide.position,
                  willChange: 'transform',
                }}
              >
                <div className="text-center text-white px-4 z-10">
                  <h1 className="font-serif text-6xl md:text-8xl mb-1 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl mb-4 tracking-wide">
                    {slide.subtitle}
                  </p>
                  <Countdown />
                  <button
                    onClick={() => onNavigate('rsvp')}
                    className="mt-12 bg-white text-rose-900 px-8 py-3 rounded-full font-medium hover:bg-rose-50 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Confirme sua Presença
                  </button>
                </div>
                
                {/* Overlay para melhor legibilidade */}
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navegação Customizada */}
        <button 
          className={`swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 text-white p-3 rounded-full transition-all ${
            isBeginning ? 'opacity-50 cursor-default' : 'opacity-100 hover:bg-white/30'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          className={`swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 text-white p-3 rounded-full transition-all ${
            isEnd ? 'opacity-50 cursor-default' : 'opacity-100 hover:bg-white/30'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Paginação Customizada */}
        <div className="swiper-pagination absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"></div>
      </section>

      {/* Seção: Vamos nos Casar! */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-rose-900 mb-6">
            Vamos nos Casar!
          </h2>
          <p className="text-xl text-gray-700 mb-4">21 de Dezembro, 2025 • São Paulo, BR</p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Com grande alegria no coração, convidamos você para celebrar conosco 
            o início desta nova jornada. Sua presença será nosso maior presente!
          </p>
        </div>
      </section>

      {/* Seção: O Casal */}
      <section className="py-20 bg-rose-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <div className="w-64 h-64 rounded-full mx-auto overflow-hidden shadow-lg mb-6 flex items-center justify-center">
                {!loadedImages['anderson'] && (
                  <div className="w-80 h-80 bg-gray-200 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                  </div>
                )}
                <img
                  src={andersonPhoto}
                  alt="Anderson"
                  className={`w-80 h-80 object-cover transition-opacity duration-500 ${
                    loadedImages['anderson'] ? 'opacity-100' : 'opacity-0 absolute'
                  }`}
                  style={{
                    transform: 'scale(1) scaleX(-1)',
                  }}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setLoadedImages(prev => ({ ...prev, 'anderson': true }))}
                />
              </div>
              <h3 className="font-serif text-3xl text-rose-900 mb-3">Anderson Lopes</h3>
              <p className="text-gray-700 italic px-6">
                "Marido, ame a sua esposa, assim como Cristo amou a Igreja e deu a sua vida por ela" - Efésios 5:25
              </p>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 rounded-full mx-auto overflow-hidden shadow-lg mb-6 flex items-center justify-center">
                {!loadedImages['thais'] && (
                  <div className="w-80 h-80 bg-gray-200 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                  </div>
                )}
                <img
                  src={thaisPhoto}
                  alt="Thais"
                  className={`w-80 h-80 object-cover transition-opacity duration-500 ${
                    loadedImages['thais'] ? 'opacity-100' : 'opacity-0 absolute'
                  }`}
                  style={{
                    transform: 'scale(0.99) scaleX(1)',
                    objectPosition: '5%'
                  }}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setLoadedImages(prev => ({ ...prev, 'thais': true }))}
                />
              </div>
              <h3 className="font-serif text-3xl text-rose-900 mb-3">Thais Duarte</h3>
              <p className="text-gray-700 italic px-6">
                "Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis" - Provérbios 31:10
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Heart className="w-12 h-12 text-rose-400 mx-auto" />
          </div>
        </div>
      </section>

      {/* Seção: Nossos Eventos Especiais */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl text-rose-900 mb-4">Nossos Eventos Especiais</h2>
          <p className="text-gray-600 mb-12">Junte-se a nós nestes momentos especiais</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-rose-50 rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-serif text-2xl text-rose-900 mb-4">Cerimônia Principal</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center justify-center gap-2">
                  <Calendar size={20} className="text-rose-600" />
                  <span>21 de Dezembro, 2025</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={20} className="text-rose-600" />
                  <span>10:00 - 12:00</span>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Cerimônia de casamento na igreja
                </p>
              </div>
            </div>

            <div className="bg-rose-50 rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-serif text-2xl text-rose-900 mb-4">Festa de Casamento</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center justify-center gap-2">
                  <Calendar size={20} className="text-rose-600" />
                  <span>21 de Dezembro, 2025</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={20} className="text-rose-600" />
                  <span>12:00 - 16:00</span>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Recepção e celebração
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Localização */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-rose-900 mb-4">Como Chegar</h2>
            <p className="text-gray-600 text-lg">Celebre conosco neste lugar especial</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Informações do Local */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h3 className="font-serif text-2xl text-rose-900 mb-4">Reis Recepções</h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin size={24} className="text-rose-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Endereço:</p>
                      <p className="text-sm leading-relaxed">
                        Rod. Pref. Bento Rotger Domingues, 4430<br />
                        Mombaça, Itapecerica da Serra - SP<br />
                        CEP: 06872-888
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar size={24} className="text-rose-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Data e Horário:</p>
                      <p className="text-sm">
                        21 de Dezembro, 2025<br />
                        Cerimônia: 10:00 - 12:00<br />
                        Recepção: 12:00 - 16:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Reis+Recepções+Rod.+Pref.+Bento+Rotger+Domingues+4430+Itapecerica+da+Serra+SP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-rose-600 text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-md"
                >
                  Abrir no Google Maps
                </a>
                <a
                  href="https://www.waze.com/ul?q=Reis+Recepções+Itapecerica+da+Serra+SP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  Abrir no Waze
                </a>
                <a
                  href="https://www.reisrecepcoes.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-100 text-gray-700 text-center px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors shadow-md"
                >
                  Visitar Site do Local
                </a>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full min-h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.3789426989367!2d-46.8523!3d-23.6947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50f0d3c3e5a9%3A0x1234567890abcdef!2sRod.%20Pref.%20Bento%20Rotger%20Domingues%2C%204430%20-%20Momba%C3%A7a%2C%20Itapecerica%20da%20Serra%20-%20SP%2C%2006872-888!5e0!3m2!1spt-BR!2sbr!4v1634567890123!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do Casamento - Reis Recepções"
              ></iframe>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 bg-rose-50 border-l-4 border-rose-600 p-6 rounded-lg">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong className="text-rose-900">Dica:</strong> O local conta com amplo estacionamento gratuito.
              Recomendamos chegar com 15-20 minutos de antecedência para acomodação confortável.
            </p>
          </div>
        </div>
      </section>

      {/* Seção: Confirmação de Presença */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=1280&q=80)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-serif text-4xl mb-6">Você vai comparecer?</h2>
          <p className="text-xl mb-8">
            Sua confirmação nos ajuda a planejar o dia mais especial de nossas vidas
          </p>
          <button
            onClick={() => onNavigate('rsvp')}
            className="bg-white text-rose-900 px-8 py-3 rounded-full font-medium hover:bg-rose-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Confirmar Presença
          </button>
        </div>
      </section>
    </div>
  );
}