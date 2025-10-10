import { Heart, Calendar, MapPin } from 'lucide-react';
import Countdown from '../components/Countdown';
import bgCover from '../photos/T_A-2.jpg'; // ajuste o nome conforme o arquivo real
import andersonPhoto from '../photos/T_A-137-V2.jpg'; // já está importado
import thaisPhoto from '../photos/T_A-80-V2.jpg'; // adicione esta linha

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${bgCover})`,
          backgroundPosition: 'center 70%',
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="font-serif text-6xl md:text-8xl mb-1 animate-fade-in">
            Thais & Anderson
          </h1>
          {/* <p className="text-2xl md:text-3xl mb-2 tracking-wide">Vamos nos casar!</p>
          <p className="text-xl mb-8">21 de Dezembro, 2025</p> */}
          <Countdown />
          <button
            onClick={() => onNavigate('rsvp')}
            className="mt-12 bg-white text-rose-900 px-8 py-3 rounded-full font-medium hover:bg-rose-50 transition-all transform hover:scale-105"
          >
            Confirme sua Presença
          </button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-rose-900 mb-6">
            Vamos nos Casar!
          </h2>
          <p className="text-xl text-gray-700 mb-4">21 de Dezembro, 2025 • São Paulo, BR</p>
          <p className="text-lg text-gray-600 leading-relaxed">
            {/* Nós convidamos você para celebrar nosso casamento */}
          </p>
        </div>
      </section>

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
                    transform: 'scale(1) scaleX(-1)', // menos zoom e invertida horizontalmente
                  }}
                />
              </div>
              <h3 className="font-serif text-3xl text-rose-900 mb-3">Anderson Lopes</h3>
              <p className="text-gray-700 italic px-6">
                "Marido, ame a sua esposa, assim como Cristo amou a Igreja e deu a sua vida por ela" - Marcos 10:8-9
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
                    objectPosition: '5%' // abaixa a foto (ajuste o segundo valor para mais ou menos)
                  }}
                />
              </div>
              <h3 className="font-serif text-3xl text-rose-900 mb-3">Thais Duarte</h3>
              <p className="text-gray-700 italic px-6">
                "Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis" - Provérbios 31:10-11
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Heart className="w-12 h-12 text-rose-400 mx-auto" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl text-rose-900 mb-4">Nossos Eventos Especiais</h2>
          <p className="text-gray-600 mb-12">Eventos de casamento</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-rose-50 rounded-lg p-8 shadow-md">
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
              </div>
            </div>

            <div className="bg-rose-50 rounded-lg p-8 shadow-md">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-serif text-4xl mb-6">Você vai comparecer?</h2>
          <p className="text-xl mb-8">Confirme sua presença e nos ajude a planejar o dia perfeito</p>
          <button
            onClick={() => onNavigate('rsvp')}
            className="bg-white text-rose-900 px-8 py-3 rounded-full font-medium hover:bg-rose-50 transition-all transform hover:scale-105"
          >
            Confirmar Presença
          </button>
        </div>
      </section>
    </div>
  );
}
