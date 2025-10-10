import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { supabase, type GuestConfirmation } from '../lib/supabase';

export default function RSVPPage() {
  const [formData, setFormData] = useState<GuestConfirmation>({
    name: '',
    email: '',
    phone: '',
    guests_count: 1,
    attending: true,
    dietary_restrictions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('guest_confirmations')
        .insert([formData]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        guests_count: 1,
        attending: true,
        dietary_restrictions: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Erro ao enviar confirmação. Tente novamente.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              name === 'guests_count' ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl text-rose-900 mb-4">Confirme sua Presença</h1>
          <p className="text-gray-600 text-lg">
            Por favor, preencha o formulário abaixo para nos informar se você poderá comparecer
          </p>
        </div>

        {submitStatus === 'success' && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="text-green-600" size={24} />
            <div>
              <p className="text-green-800 font-medium">Confirmação enviada com sucesso!</p>
              <p className="text-green-700 text-sm">Obrigado por confirmar sua presença.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <p className="text-red-800 font-medium">Erro ao enviar confirmação</p>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-rose-50 rounded-lg p-8 shadow-md">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="attending" className="block text-gray-700 font-medium mb-2">
                Você vai comparecer? *
              </label>
              <select
                id="attending"
                name="attending"
                required
                value={formData.attending.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, attending: e.target.value === 'true' }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
              >
                <option value="true">Sim, estarei presente</option>
                <option value="false">Infelizmente não poderei comparecer</option>
              </select>
            </div>

            {formData.attending && (
              <>
                <div>
                  <label htmlFor="guests_count" className="block text-gray-700 font-medium mb-2">
                    Número de Convidados *
                  </label>
                  <input
                    type="number"
                    id="guests_count"
                    name="guests_count"
                    min="1"
                    max="10"
                    required
                    value={formData.guests_count}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="dietary_restrictions" className="block text-gray-700 font-medium mb-2">
                    Restrições Alimentares
                  </label>
                  <textarea
                    id="dietary_restrictions"
                    name="dietary_restrictions"
                    rows={3}
                    value={formData.dietary_restrictions}
                    onChange={handleChange}
                    placeholder="Ex: vegetariano, alergia a frutos do mar, etc."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition resize-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Presença'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
