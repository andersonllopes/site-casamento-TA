import { useState, useEffect } from 'react';
import { Heart, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, type GuestMessage } from '../lib/supabase';

export default function MessagesPage() {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Buscando mensagens do Supabase...');
      
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      console.log('📦 Resposta completa:', { data, error });

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        
        // Se for erro de RLS, mostra mensagem específica
        if (error.message.includes('ROW LEVEL SECURITY') || error.code === '42501') {
          console.error('🔒 Erro de RLS - Verifique as políticas no Supabase');
        }
        return;
      }

      if (data) {
        console.log(`✅ ${data.length} mensagens carregadas:`, data);
        setMessages(data);
      } else {
        console.log('📭 Nenhum dado retornado');
        setMessages([]);
      }

    } catch (error) {
      console.error('💥 Erro inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      console.log('📤 Enviando mensagem...', formData);
      
      const { error } = await supabase
        .from('guest_messages')
        .insert([{ 
          name: formData.name.trim(),
          message: formData.message.trim(),
          approved: false
        }]);

      if (error) {
        console.error('❌ Erro ao enviar:', error);
        throw error;
      }

      console.log('✅ Mensagem enviada com sucesso!');
      setSubmitStatus('success');
      setFormData({ name: '', message: '' });
      
      // Recarrega as mensagens após 2 segundos
      setTimeout(() => {
        fetchMessages();
        setSubmitStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('💥 Erro no envio:', error);
      setSubmitStatus('error');
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
                placeholder="Digite seu nome"
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
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                'Enviar Mensagem'
              )}
            </button>
          </form>
        </div>

        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-3xl text-rose-900">
              Mensagens de Amigos e Familiares ({messages.length})
            </h2>
            <button
              onClick={fetchMessages}
              disabled={isLoading}
              className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 disabled:bg-gray-400 transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Carregando mensagens...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-rose-300" />
              <p>Nenhuma mensagem aprovada ainda. Seja o primeiro a deixar uma mensagem!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-rose-400 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Heart className="text-rose-400 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed mb-3 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-rose-600 font-medium text-sm">— {msg.name}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
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