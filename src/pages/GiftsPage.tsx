import { Gift, ExternalLink, Copy, Check, Heart } from 'lucide-react';
import { useState } from 'react';
import pix from '../photos/pix/qrpix.jpeg';

interface GiftStore {
  name: string;
  url: string;
  icon: string;
}

export default function GiftsPage() {
  const [copiedPix, setCopiedPix] = useState(false);

  const pixKey = 'andersoncley2009@gmail.com';

  const stores: GiftStore[] = [
    {
      name: 'ICasei',
      url: 'https://sites.icasei.com.br/andersonthais/pages/35091204',
      icon: '🛍️'
    },
    // {
    //   name: 'Magazine Luiza',
    //   url: 'https://www.magazineluiza.com.br',
    //   icon: '🏪'
    // },
    // {
    //   name: 'Casas Bahia',
    //   url: 'https://www.casasbahia.com.br',
    //   icon: '🏠'
    // },
    // {
    //   name: 'Amazon',
    //   url: 'https://www.amazon.com.br',
    //   icon: '📦'
    // }
  ];

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Gift className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h1 className="font-serif text-5xl text-rose-900 mb-4">Lista de Presentes</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Sua presença é o nosso maior presente! Mas se desejar nos presentear,
            escolha uma das opções abaixo.
          </p>
        </div>

        <div className="bg-rose-50 rounded-lg p-8 mb-8 shadow-md">
          <h2 className="font-serif text-2xl text-rose-900 mb-4 text-center">PIX</h2>
          <p className="text-gray-700 text-center mb-6">
            Você pode contribuir diretamente via PIX
          </p>

          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-2">Chave PIX:</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-gray-100 px-4 py-3 rounded text-gray-800 font-mono text-sm break-all">
                {pixKey}
              </code>
              <button
                onClick={copyPixKey}
                className="flex-shrink-0 bg-rose-600 text-white p-3 rounded-lg hover:bg-rose-700 transition-colors"
                title="Copiar chave PIX"
              >
                {copiedPix ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            {copiedPix && (
              <p className="text-green-600 text-sm mt-2 text-center">Chave PIX copiada!</p>
            )}
          </div>

          <div className="mt-6 bg-white rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-4 text-center">Ou escaneie o QR Code:</p>
            <div className="bg-gray-100 w-64 h-64 mx-auto rounded-lg flex items-center justify-center p-4">
              <img 
                src={pix} 
                alt="QR Code PIX" 
                className="w-full h-full object-contain rounded-lg" 
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-rose-900 mb-6 text-center">Lojas Parceiras</h2>
          <p className="text-gray-600 text-center mb-8">
            Escolha presentes em nossas lojas favoritas
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {stores.map((store, index) => (
              <a
                key={index}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rose-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{store.icon}</span>
                    <div>
                      <h3 className="font-serif text-xl text-rose-900 group-hover:text-rose-700 transition-colors">
                        {store.name}
                      </h3>
                      <p className="text-sm text-gray-600">Clique para visitar</p>
                    </div>
                  </div>
                  <ExternalLink className="text-rose-600 group-hover:text-rose-700 transition-colors" size={24} />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-rose-50 rounded-lg p-8 text-center">
          <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h3 className="font-serif text-2xl text-rose-900 mb-3">Agradecemos de coração!</h3>
          <p className="text-gray-700">
            Cada presente é uma demonstração de carinho e será muito especial para nós.
            Obrigado por fazer parte deste momento tão importante em nossas vidas!
          </p>
        </div>
      </div>
    </div>
  );
}