export default function StoryPage() {
  const timeline = [
    {
      title: 'Primeiro, nós nos conhecemos',
      description: 'Nos conhecemos através das redes sociais, mas desde o começo sentimos algo diferente. As conversas fluíam com leveza, e mesmo à distância, havia uma certeza no coração de que estávamos no caminho certo. Não foi por acaso. Desde o primeiro contato, sabíamos que havia algo maior nos unindo, e essa certeza só cresceu com o tempo.',
      image: 'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Nosso primeiro encontro',
      description: 'Um convite para jantar e cinema. Simples, mas inesquecível. Era o nosso primeiro encontro, e o nervosismo foi logo substituído por sorrisos, olhares tímidos e uma conexão ainda mais forte. Foi então que nos demos conta: o que nasceu como uma história leve e sincera se tornava uma linda promessa.',
      image: 'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Hoje, em um relacionamento',
      description: 'Desde então, temos caminhado juntos, lado a lado, com os corações firmados em Deus. Construímos um relacionamento com base no amor, no respeito e na fé. Somos resposta de oração um para o outro, e hoje celebramos não apenas o nosso amor, mas tudo o que Deus tem feito em nós e através de nós. Este casamento é mais um capítulo da linda história que Ele está escrevendo.',
      image: 'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

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
              <div className="w-full md:w-1/2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
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
