import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Heart, Calendar, MapPin } from 'lucide-react';
import Countdown from '../components/Countdown';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Importe suas fotos - ajuste os caminhos conforme necessário
import bgCover1 from '../photos/T_A-2.jpg';
import bgCover2 from '../photos/T_A-3.jpg';
import bgCover3 from '../photos/T_A-4.jpg';
import bgCover4 from '../photos/T_A-5.jpg';
import andersonPhoto from '../photos/rosto/T_A-137-V2.jpg';
import thaisPhoto from '../photos/rosto/T_A-80-V2.jpg';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const slides = [
  {
    image: bgCover1,
    title: 'Thais & Anderson',
    subtitle: '21 de Dezembro, 2025'
  },
  {
    image: bgCover2,
    title: 'Nosso Amor',
    subtitle: 'Vamos nos Casar!'
  },
  {
    image: bgCover3,
    title: 'Celebre Conosco',
    subtitle: 'São Paulo, BR'
  },
  {
    image: bgCover4,
    title: 'Thais & Anderson',
    subtitle: '21 de Dezembro, 2025'
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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
                  backgroundPosition: 'center 70%',
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
          className={`swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all ${
            isBeginning ? 'opacity-50 cursor-default' : 'opacity-100'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          className={`swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all ${
            isEnd ? 'opacity-50 cursor-default' : 'opacity-100'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Paginação Customizada */}
        <div className="swiper-pagination absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2"></div>
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
                <img
                  src={andersonPhoto}
                  alt="Anderson"
                  className="w-80 h-80 object-cover"
                  style={{
                    transform: 'scale(1) scaleX(-1)',
                  }}
                />
              </div>
              <h3 className="font-serif text-3xl text-rose-900 mb-3">Anderson Lopes</h3>
              <p className="text-gray-700 italic px-6">
                "Marido, ame a sua esposa, assim como Cristo amou a Igreja e deu a sua vida por ela" - Efésios 5:25
              </p>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 rounded-full mx-auto overflow-hidden shadow-lg mb-6 flex items-center justify-center">
                <img
                  src={thaisPhoto}
                  alt="Thais"
                  className="w-80 h-80 object-cover"
                  style={{
                    transform: 'scale(0.99) scaleX(1)',
                    objectPosition: '5%'
                  }}
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

      {/* Seção: Confirmação de Presença */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=1920)',
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

      {/* Estilos customizados para o Swiper */}
      <style jsx>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          width: 12px;
          height: 12px;
        }
        .swiper-pagination-bullet-active {
          background: white;
          transform: scale(1.2);
        }
        .swiper-button-prev,
        .swiper-button-next {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
          display: none;
        }
      `}</style>
    </div>
  );
}