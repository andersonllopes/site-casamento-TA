import { useState, useEffect, useRef } from 'react';

// Verifique se estes caminhos estão corretos
import ta70Photo from '../photos/T_A-70.jpg';
import ta99Photo from '../photos/T_A-99.jpg';
import ta176Photo from '../photos/T_A-176.jpg';

export default function StoryPage() {
  const [loadedImages, setLoadedImages] = useState<{[key: number]: boolean}>({});
  const [visibleImages, setVisibleImages] = useState<{[key: number]: boolean}>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Pré-carrega a primeira imagem imediatamente
    setVisibleImages(prev => ({ ...prev, 0: true }));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleImages(prev => ({ ...prev, [index]: true }));
          }
        });
      },
      {
        rootMargin: '50px', // Reduzi a margem para carregar mais cedo
        threshold: 0.1
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const timeline = [
    {
      title: 'Primeiro, nós nos conhecemos',
      description: 'Nos conhecemos através das redes sociais, mas desde o começo sentimos algo diferente. As conversas fluíam com leveza, e mesmo à distância, havia uma certeza no coração de que estávamos no caminho certo. Não foi por acaso. Desde o primeiro contato, sabíamos que havia algo maior nos unindo, e essa certeza só cresceu com o tempo.',
      image: ta70Photo,
    },
    {
      title: 'Nosso primeiro encontro',
      description: 'Um convite para jantar e cinema. Simples, mas inesquecível. Era o nosso primeiro encontro, e o nervosismo foi logo substituído por sorrisos, olhares tímidos e uma conexão ainda mais forte. Foi então que nos demos conta: o que nasceu como uma história leve e sincera se tornava uma linda promessa.',
      image: ta99Photo,
    },
    {
      title: 'Hoje, em um relacionamento',
      description: 'Desde então, temos caminhado juntos, lado a lado, com os corações firmados em Deus. Construímos um relacionamento com base no amor, no respeito e na fé. Somos resposta de oração um para o outro, e hoje celebramos não apenas o nosso amor, mas tudo o que Deus tem feito em nós e através de nós. Este casamento é mais um capítulo da linda história que Ele está escrevendo.',
      image: ta176Photo,
    }
  ];

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index: number) => {
    console.error(`Erro ao carregar imagem ${index}`);
    setLoadedImages(prev => ({ ...prev, [index]: true })); // Marca como carregada mesmo com erro
  };

  const setImageRef = (el: HTMLDivElement | null, index: number) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-rose-600 text-sm uppercase tracking-wide mb-2">Nós nos amamos</p>
          <h1 className="font-serif text-5xl text-rose-900 mb-4">Nossa História</h1>
          <p className="text-gray-600 text-lg">Nossa história é feita de encontros, sonhos e amor</p>
        </div>

        <div className="space-y-16">
          {timeline.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
            >
              <div
                className="w-full md:w-1/2 relative min-h-80"
                ref={(el) => setImageRef(el, index)}
                data-index={index}
              >
                {/* Placeholder enquanto carrega */}
                {!loadedImages[index] && (
                  <div className="rounded-lg bg-gray-200 w-full h-80 flex items-center justify-center absolute inset-0">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mb-2"></div>
                      <p className="text-gray-500 text-sm">Carregando...</p>
                    </div>
                  </div>
                )}
                
                {/* Sempre renderiza a imagem, mas controla a visibilidade */}
                <img
                  src={item.image}
                  alt={item.title}
                  className={`rounded-lg shadow-lg w-full h-80 object-cover transition-all duration-500 ${
                    loadedImages[index] && visibleImages[index]
                      ? 'opacity-100 transform scale-100'
                      : 'opacity-0 transform scale-95'
                  }`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  loading={index === 0 ? "eager" : "lazy"} // Primeira imagem carrega prioritariamente
                />
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="bg-rose-50 rounded-lg p-8">
                  <h3 className="font-serif text-2xl text-rose-900 mb-4">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}