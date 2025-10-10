import { useState, useEffect } from 'react';
import { Heart, Check, AlertCircle } from 'lucide-react';
import { supabase, type GuestMessage } from '../lib/supabase';

export default function MessagesPage() {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('guest_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('guest_messages')
        .insert([formData]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-rose-600 text-sm uppercase tracking-wide mb-2">Muitas Felicidades</p>
          <h1 className="font-serif text-5xl text-rose-900 mb-4">Deixe um Recado</h1>
          <p className="text-gray-600 text-lg">
            Compartilhe seus votos e mensagens de felicidade para os noivos
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          {submitStatus === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <Check className="text-green-600" size={24} />
              <div>
                <p className="text-green-800 font-medium">Mensagem enviada com sucesso!</p>
                <p className="text-green-700 text-sm">Sua mensagem será exibida após aprovação.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <p className="text-red-800">Erro ao enviar mensagem. Tente novamente.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Seu Nome *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Sua Mensagem *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Escreva seus votos de felicidade para o casal..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-rose-900 mb-8 text-center">
            Mensagens de Amigos e Familiares
          </h2>

          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-rose-300" />
              <p>Seja o primeiro a deixar uma mensagem para os noivos!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-rose-400"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Heart className="text-rose-400 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed mb-2">{msg.message}</p>
                      <p className="text-rose-600 font-medium text-sm">- {msg.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
