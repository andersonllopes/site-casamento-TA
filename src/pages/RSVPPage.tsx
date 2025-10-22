import { useState, useEffect } from 'react';
import { Check, AlertCircle, Info, Plus, Trash2, Key } from 'lucide-react';
import { supabase, type GuestConfirmation } from '../lib/supabase';

interface Child {
  id: string;
  nome: string;
  data_nascimento: string;
  idade?: number;
}

interface GuestConfirmationWithChildren extends GuestConfirmation {
  dados_criancas?: Child[];
  quantidade_criancas?: number;
  criancas_0_a_4_anos?: number;
  criancas_5_a_10_anos?: number;
  criancas_acima_10_anos?: number;
  total_pessoas?: number;
}

interface InviteCode {
  codigo: string;
  max_convidados: number;
  nomes_convidados: string;
  utilizado: boolean;
}

export default function RSVPPage() {
  const [step, setStep] = useState<'code' | 'form'>('code');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteData, setInviteData] = useState<InviteCode | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeError, setCodeError] = useState('');

  const [formData, setFormData] = useState<GuestConfirmationWithChildren>({
    nome: '',
    email: '',
    telefone: '',
    quantidade_adultos: 1,
    confirmado: true,
    restricoes_alimentares: '',
    dados_criancas: [],
    quantidade_criancas: 0,
    criancas_0_a_4_anos: 0,
    criancas_5_a_10_anos: 0,
    criancas_acima_10_anos: 0,
    total_pessoas: 1,
    codigo_convite: '',
    max_convidados: 1,
    nomes_convidados: ''
  });

  const [children, setChildren] = useState<Child[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Validar código do convite
  const validateInviteCode = async (code: string) => {
    if (!code.trim()) {
      setCodeError('Por favor, digite o código do convite');
      return;
    }

    setIsValidatingCode(true);
    setCodeError('');

    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('codigo', code.toUpperCase())
        .single();

      if (error) throw error;

      if (!data) {
        setCodeError('Código inválido. Verifique e tente novamente.');
        return;
      }

      if (data.utilizado) {
        setCodeError('Este código já foi utilizado.');
        return;
      }

      setInviteData(data);
      setFormData(prev => ({
        ...prev,
        codigo_convite: data.codigo,
        max_convidados: data.max_convidados,
        nomes_convidados: data.nomes_convidados,
        quantidade_adultos: Math.min(prev.quantidade_adultos, data.max_convidados)
      }));
      setStep('form');
    } catch (error) {
      console.error('Erro ao validar código:', error);
      setCodeError('Erro ao validar código. Tente novamente.');
    } finally {
      setIsValidatingCode(false);
    }
  };

  // Calcular idade a partir da data de nascimento
  const calculateAge = (dataNascimento: string): number => {
    const today = new Date();
    const birth = new Date(dataNascimento);
    let idade = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      idade--;
    }
    
    return idade;
  };

  // Calcular estatísticas das crianças com a nova lógica CORRIGIDA
  const calculateChildrenStats = (childrenList: Child[]) => {
    const childrenWithAge = childrenList.map(child => ({
      ...child,
      idade: child.data_nascimento ? calculateAge(child.data_nascimento) : undefined
    }));

    // Lógica CORRIGIDA conforme sua regra:
    // 0-4 anos: não contam (idade < 5)
    // 5-10 anos: meia entrada (idade >= 5 e <= 10) - 2 meias = 1 inteira
    // Acima de 10 anos: inteira (idade > 10)
    const criancas0a4 = childrenWithAge.filter(child => child.idade !== undefined && child.idade < 5).length;
    const criancas5a10 = childrenWithAge.filter(child => child.idade !== undefined && child.idade >= 5 && child.idade <= 10).length;
    const criancasAcima10 = childrenWithAge.filter(child => child.idade !== undefined && child.idade > 10).length;
    
    // Calcular o total de "pessoas equivalentes" - CORRIGIDO
    // criancas0a4: 0 (não contam)
    // criancas5a10: 0.5 cada (meia entrada) - 2 meias = 1 inteira
    // criancasAcima10: 1 cada (inteira)
    
    const meiasEntradas = criancas5a10;
    const inteirasDeMeias = Math.ceil(meiasEntradas / 2); // 2 meias = 1 inteira
    const equivalenteCriancas = inteirasDeMeias + criancasAcima10;
    
    const totalPessoas = formData.quantidade_adultos + equivalenteCriancas;

    return {
      childrenWithAge,
      criancas0a4: criancas0a4,
      criancas5a10: criancas5a10,
      criancasAcima10: criancasAcima10,
      totalPessoas: totalPessoas
    };
  };

  const addChild = () => {
    const newChildren = [...children, { id: Date.now().toString(), nome: '', data_nascimento: '' }];
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
        if (field === 'data_nascimento' && value) {
          updatedChild.idade = calculateAge(value);
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
      dados_criancas: childrenList,
      quantidade_criancas: childrenList.length,
      criancas_0_a_4_anos: stats.criancas0a4,
      criancas_5_a_10_anos: stats.criancas5a10,
      criancas_acima_10_anos: stats.criancasAcima10,
      total_pessoas: stats.totalPessoas
    }));
  };

  const handleGuestsCountChange = (value: number) => {
    if (value > (inviteData?.max_convidados || 1)) {
      return; // Não permite exceder o máximo
    }

    setFormData(prev => {
      const stats = calculateChildrenStats(children);
      return {
        ...prev,
        quantidade_adultos: value,
        total_pessoas: stats.totalPessoas
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Verificar novamente se o código ainda é válido
      const { data: codeCheck } = await supabase
        .from('invite_codes')
        .select('utilizado')
        .eq('codigo', inviteData?.codigo)
        .single();

      if (codeCheck?.utilizado) {
        throw new Error('Este código já foi utilizado. Por favor, entre em contato conosco.');
      }

      const stats = calculateChildrenStats(children);
      const finalTotalPeople = stats.totalPessoas;
      
      const finalFormData = {
        ...formData,
        dados_criancas: children,
        quantidade_criancas: children.length,
        criancas_0_a_4_anos: stats.criancas0a4,
        criancas_5_a_10_anos: stats.criancas5a10,
        criancas_acima_10_anos: stats.criancasAcima10,
        total_pessoas: finalTotalPeople
      };

      // Inserir confirmação
      const { error: confirmationError } = await supabase
        .from('guest_confirmations')
        .insert([finalFormData]);

      if (confirmationError) throw confirmationError;

      // Marcar código como usado
      const { error: codeUpdateError } = await supabase
        .from('invite_codes')
        .update({ utilizado: true })
        .eq('codigo', inviteData?.codigo);

      if (codeUpdateError) throw codeUpdateError;

      setSubmitStatus('success');
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Erro ao enviar confirmação. Tente novamente.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'quantidade_adultos') {
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
    // Reset completo
    setStep('code');
    setInviteCode('');
    setInviteData(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      quantidade_adultos: 1,
      confirmado: true,
      restricoes_alimentares: '',
      dados_criancas: [],
      quantidade_criancas: 0,
      criancas_0_a_4_anos: 0,
      criancas_5_a_10_anos: 0,
      criancas_acima_10_anos: 0,
      total_pessoas: 1,
      codigo_convite: '',
      max_convidados: 1,
      nomes_convidados: ''
    });
    setChildren([]);
  };

  const backToCode = () => {
    setStep('code');
    setInviteData(null);
    setCodeError('');
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl text-rose-900 mb-4">Confirme sua Presença</h1>
          <p className="text-gray-600 text-lg">
            Por favor, insira o código do seu convite para confirmar sua presença
          </p>
        </div>

        {/* ETAPA 1: Validação do Código */}
        {step === 'code' && (
          <div className="bg-rose-50 rounded-lg p-8 shadow-md">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-100 mb-4">
                <Key className="h-8 w-8 text-rose-600" />
              </div>
              <h2 className="text-2xl font-serif text-gray-900 mb-2">
                Código do Convite
              </h2>
              <p className="text-gray-600">
                Digite o código que você recebeu em seu convite
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="inviteCode" className="block text-gray-700 font-medium mb-2">
                  Código do Convite *
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Ex: CASAMENTO001"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition text-center font-mono uppercase"
                />
              </div>

              {codeError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={20} />
                  <p className="text-red-700">{codeError}</p>
                </div>
              )}

              <button
                onClick={() => validateInviteCode(inviteCode)}
                disabled={isValidatingCode || !inviteCode.trim()}
                className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isValidatingCode ? 'Validando...' : 'Validar Código'}
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: Formulário de Confirmação */}
        {step === 'form' && inviteData && (
          <>
            {/* Cabeçalho com informações do convite */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-800 font-medium">Convite Validado ✓</p>
                  <p className="text-green-700 text-sm">
                    {inviteData.nomes_convidados} • Máximo de {inviteData.max_convidados} adulto(s)
                  </p>
                </div>
                <button
                  onClick={backToCode}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Trocar Código
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-rose-50 rounded-lg p-8 shadow-md">
              <div className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    value={formData.nome}
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
                  <label htmlFor="telefone" className="block text-gray-700 font-medium mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="confirmado" className="block text-gray-700 font-medium mb-2">
                    Você vai comparecer? *
                  </label>
                  <select
                    id="confirmado"
                    name="confirmado"
                    required
                    value={formData.confirmado.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmado: e.target.value === 'true' }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                  >
                    <option value="true">Sim, estarei presente</option>
                    <option value="false">Infelizmente não poderei comparecer</option>
                  </select>
                </div>

                {formData.confirmado && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="quantidade_adultos" className="block text-gray-700 font-medium">
                          Número de Adultos *
                        </label>
                        <span className="text-sm text-gray-500">
                          {formData.quantidade_adultos} de {inviteData.max_convidados} permitidos
                        </span>
                      </div>
                      <input
                        type="number"
                        id="quantidade_adultos"
                        name="quantidade_adultos"
                        min="1"
                        max={inviteData.max_convidados}
                        required
                        value={formData.quantidade_adultos}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                      />
                    </div>

                    {/* Seção de Crianças - simplificada para os convidados */}
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
                                  value={child.nome}
                                  onChange={(e) => updateChild(child.id, 'nome', e.target.value)}
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
                                  value={child.data_nascimento}
                                  onChange={(e) => updateChild(child.id, 'data_nascimento', e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-200 outline-none transition"
                                />
                                {child.idade !== undefined && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Idade: {child.idade} anos
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                      
                    <div>
                      <label htmlFor="restricoes_alimentares" className="block text-gray-700 font-medium mb-2">
                        Restrições Alimentares ou Alergias
                      </label>
                      <textarea
                        id="restricoes_alimentares"
                        name="restricoes_alimentares"
                        rows={3}
                        value={formData.restricoes_alimentares}
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
          </>
        )}

        {/* Modal de Sucesso */}
        {submitStatus === 'success' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto animate-scale-in">
              <div className="text-center">
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
      </div>
    </div>
  );
}