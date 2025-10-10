import { useState } from 'react';
import { Check, AlertCircle, Info, Plus, Trash2 } from 'lucide-react';
import { supabase, type GuestConfirmation } from '../lib/supabase';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  age?: number;
}

interface GuestConfirmationWithChildren extends GuestConfirmation {
  children_data?: Child[];
  children_count?: number;
  children_under_5?: number;
  children_over_5?: number;
  total_people_count?: number;
}

export default function RSVPPage() {
  const [formData, setFormData] = useState<GuestConfirmationWithChildren>({
    name: '',
    email: '',
    phone: '',
    guests_count: 1,
    attending: true,
    dietary_restrictions: '',
    children_data: [],
    children_count: 0,
    children_under_5: 0,
    children_over_5: 0,
    total_people_count: 1
  });

  const [children, setChildren] = useState<Child[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Calcular idade a partir da data de nascimento
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Calcular estatísticas das crianças (oculto do usuário)
  const calculateChildrenStats = (childrenList: Child[]) => {
    const childrenWithAge = childrenList.map(child => ({
      ...child,
      age: child.birthDate ? calculateAge(child.birthDate) : undefined
    }));

    const under5 = childrenWithAge.filter(child => child.age !== undefined && child.age <= 4).length;
    const over5 = childrenWithAge.filter(child => child.age !== undefined && child.age >= 5).length;
    
    // Cálculo total CORRETO: adultos + (crianças até 4 anos * 0.5) + (crianças 5+ anos * 1)
    // SEM arredondamento - usa valores decimais exatos
    const totalPeople = formData.guests_count + (under5 * 0.5) + (over5 * 1);

    return {
      childrenWithAge,
      childrenUnder5: under5,
      childrenOver5: over5,
      totalPeople: totalPeople
    };
  };

  const addChild = () => {
    const newChildren = [...children, { id: Date.now().toString(), name: '', birthDate: '' }];
    setChildren(newChildren);
    
    const stats = calculateChildrenStats(newChildren);
    updateFormDataWithStats(stats, newChildren);
  };

  const removeChild = (id: string) => {
    const newChildren = children.filter(child => child.id !== id);
    setChildren(newChildren);
    
    const stats = calculateChildrenStats(newChildren);
    updateFormDataWithStats(stats, newChildren);
  };

  const updateChild = (id: string, field: keyof Child, value: string) => {
    const newChildren = children.map(child => {
      if (child.id === id) {
        const updatedChild = { ...child, [field]: value };
        if (field === 'birthDate' && value) {
          updatedChild.age = calculateAge(value);
        }
        return updatedChild;
      }
      return child;
    });
    
    setChildren(newChildren);
    const stats = calculateChildrenStats(newChildren);
    updateFormDataWithStats(stats, newChildren);
  };

  const updateFormDataWithStats = (stats: any, childrenList: Child[]) => {
    setFormData(prev => ({
      ...prev,
      children_data: childrenList,
      children_count: childrenList.length,
      children_under_5: stats.childrenUnder5,
      children_over_5: stats.childrenOver5,
      total_people_count: stats.totalPeople
    }));
  };

  const handleGuestsCountChange = (value: number) => {
    setFormData(prev => {
      const stats = calculateChildrenStats(children);
      return {
        ...prev,
        guests_count: value,
        total_people_count: value + (stats.childrenUnder5 * 0.5) + (stats.childrenOver5 * 1) // SEM Math.ceil
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Garantir que os dados das crianças estão atualizados
      const stats = calculateChildrenStats(children);
      
      // Usar o valor decimal exato - SEM arredondamento
      const finalTotalPeople = stats.totalPeople;
      
      const finalFormData = {
        ...formData,
        children_data: children,
        children_count: children.length,
        children_under_5: stats.childrenUnder5,
        children_over_5: stats.childrenOver5,
        total_people_count: finalTotalPeople
      };

      console.log('Enviando dados:', finalFormData);

      const { error } = await supabase
        .from('guest_confirmations')
        .insert([finalFormData]);

      if (error) throw error;

      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        guests_count: 1,
        attending: true,
        dietary_restrictions: '',
        children_data: [],
        children_count: 0,
        children_under_5: 0,
        children_over_5: 0,
        total_people_count: 1
      });
      setChildren([]);
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
    
    if (name === 'guests_count') {
      handleGuestsCountChange(parseInt(value));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const closeSuccessModal = () => {
    setSubmitStatus('idle');
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

        {/* Mensagens Informativas (sem menção à contagem) */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 mt-1 flex-shrink-0" size={20} />
            <div className="space-y-3">
              <p className="text-blue-800 font-medium">Informações Importantes:</p>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Cada convite é pessoal e intransferível</li>
                <li>• Convidado não convida</li>
                <li>• Para famílias com crianças, informe nome e data de nascimento de cada uma</li>
                <li>• Isso nos ajuda no planejamento adequado do evento</li>
                <li>• Confirmações devem ser feitas até 15/12/2025</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal de Sucesso */}
        {submitStatus === 'success' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto animate-scale-in">
              <div className="text-center">
                {/* Ícone de sucesso animado */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-600 animate-checkmark" />
                </div>
                
                <h3 className="text-2xl font-serif text-gray-900 mb-2">
                  Confirmação Enviada!
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Obrigado por confirmar sua presença em nosso casamento. 
                  Estamos muito felizes em compartilhar este momento especial com você!
                </p>

                <div className="bg-rose-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-rose-700">
                    💝 Qualquer alteração, entraremos em contato.
                  </p>
                </div>

                <button
                  onClick={closeSuccessModal}
                  className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors duration-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem de Erro */}
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
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="guests_count" className="block text-gray-700 font-medium">
                      Número de Adultos *
                    </label>
                    <span className="text-sm text-gray-500">Incluindo você</span>
                  </div>
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

                {/* Seção de Crianças - totalmente oculta a contagem */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Crianças da Família</label>
                    <button
                      type="button"
                      onClick={addChild}
                      className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                    >
                      <Plus size={16} />
                      Adicionar Criança
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Informe os dados das crianças para nos ajudar no planejamento do evento.
                  </p>

                  <div className="space-y-4">
                    {children.map((child, index) => (
                      <div key={child.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-gray-700 font-medium">Criança {index + 1}</label>
                          <button
                            type="button"
                            onClick={() => removeChild(child.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Nome da Criança
                            </label>
                            <input
                              type="text"
                              value={child.name}
                              onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-200 outline-none transition"
                              placeholder="Nome completo"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Data de Nascimento *
                            </label>
                            <input
                              type="date"
                              required
                              value={child.birthDate}
                              onChange={(e) => updateChild(child.id, 'birthDate', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-200 outline-none transition"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="dietary_restrictions" className="block text-gray-700 font-medium mb-2">
                    Restrições Alimentares ou Alergias
                  </label>
                  <textarea
                    id="dietary_restrictions"
                    name="dietary_restrictions"
                    rows={3}
                    value={formData.dietary_restrictions}
                    onChange={handleChange}
                    placeholder="Informe restrições para adultos e crianças..."
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

      {/* Adicionar animações CSS */}
      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes checkmark {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-checkmark {
          animation: checkmark 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}