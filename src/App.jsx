import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  MessageCircle,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Menu,
  X,
  ChevronRight,
  Heart,
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

const psico = {
  name: 'Luana Sakovicz',
  title: 'Psicóloga Clínica',
  crp: 'CRP 06/123456',
  crpStatus: 'em processo de registro',
  description:
    'Auxiliando pessoas no processo de autoconhecimento e cuidado com a saúde mental através de uma escuta ética e acolhedora.',
  whatsapp: '5541991369954',
  whatsappDisplay: '(41) 99136-9954',
  email: 'luana.sakovicz@gmail.com',
  instagram: 'https://www.instagram.com/lu_sakovicz',
  linkedin: 'https://www.linkedin.com/in/luana-sakovicz-353b7111b',
  city: 'Campo Largo, PR',
};

const specialties = [
  {
    title: 'Psicoterapia Individual',
    description:
      'Atendimento focado no autoconhecimento e resolução de conflitos internos para adultos e adolescentes.',
    icon: <User className="w-6 h-6" />,
  },
  {
    title: 'Ansiedade e Depressão',
    description:
      'Acompanhamento especializado para manejo de sintomas e busca por qualidade de vida.',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    title: 'Orientação Profissional',
    description:
      'Auxílio na descoberta de caminhos na carreira e transições profissionais importantes.',
    icon: <BookOpen className="w-6 h-6" />,
  },
];

const navLinks = [
  { name: 'Início', href: '#home' },
  { name: 'Sobre', href: '#about' },
  { name: 'Serviços', href: '#services' },
  { name: 'Contato', href: '#contact' },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [reflectionText, setReflectionText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [errorAi, setErrorAi] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGeminiReflection = async () => {
    if (!reflectionText.trim()) return;

    setIsLoadingAi(true);
    setErrorAi('');
    setAiResponse('');

    const systemPrompt = `Você é um assistente de acolhimento para o site da Psicóloga ${psico.name}. 
    O usuário vai descrever brevemente como está se sentindo. Sua tarefa é:
    1. Validar o sentimento de forma empática e profissional (máximo 2 frases).
    2. Sugerir uma pergunta reflexiva para ele levar para a primeira sessão de terapia.
    3. Manter um tom calmo, ético e encorajador.
    Importante: Não dê diagnósticos nem conselhos médicos.`;

    let retries = 0;
    const maxRetries = 5;

    const callApi = async () => {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: reflectionText }] }],
              systemInstruction: { parts: [{ text: systemPrompt }] },
            }),
          }
        );

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setAiResponse(text ?? 'Não foi possível gerar uma resposta. Tente novamente.');
      } catch {
        if (retries < maxRetries) {
          retries++;
          const delay = Math.pow(2, retries) * 500;
          await new Promise((res) => setTimeout(res, delay));
          return callApi();
        }
        setErrorAi(
          'Desculpe, não consegui processar sua reflexão agora. Que tal enviar sua mensagem diretamente abaixo?'
        );
      } finally {
        setIsLoadingAi(false);
      }
    };

    await callApi();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!FORMSPREE_ID) {
      setFormStatus('error');
      return;
    }
    setFormStatus('loading');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <span className="text-xl font-serif font-semibold tracking-tight text-teal-800">
            Psic. {psico.name}
          </span>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-teal-600 transition-colors uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white absolute w-full px-6 py-8 border-b border-stone-100 flex flex-col space-y-4 shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-stone-600"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-teal-700 font-medium tracking-widest uppercase text-sm">
              Bem-vinda(o)
            </h2>
            <h1 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight">
              Cuidar da mente é um ato de <span className="italic">coragem</span>.
            </h1>
            <p className="text-lg text-stone-600 max-w-lg leading-relaxed">
              {psico.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <a
                href={`https://wa.me/${psico.whatsapp}?text=Olá%20Luana%2C%20gostaria%20de%20agendar%20uma%20consulta!`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-700 text-white px-8 py-4 rounded-full font-medium hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20 text-center"
              >
                Agendar Consulta
              </a>
              <a
                href="#about"
                className="border border-stone-300 px-8 py-4 rounded-full font-medium hover:bg-stone-100 transition-all text-center"
              >
                Conheça meu trabalho
              </a>
            </div>
          </div>
          <div className="flex-1 relative flex justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-teal-100 rounded-[40px] rotate-6 absolute inset-0 -z-10"></div>
            <div className="w-64 h-64 md:w-96 md:h-96 bg-stone-200 rounded-[40px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                alt="Retrato profissional"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-stone-900 mb-4">Áreas de Atuação</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Ofereço um espaço seguro para o desenvolvimento da sua saúde mental através de
              abordagens baseadas em evidências.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {specialties.map((spec, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-stone-50 hover:bg-teal-50 border border-stone-100 transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-teal-600">
                  {spec.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800">{spec.title}</h3>
                <p className="text-stone-600 leading-relaxed mb-6">{spec.description}</p>
                <a
                  href={`https://wa.me/${psico.whatsapp}?text=Olá%20Luana%2C%20tenho%20interesse%20em%20${encodeURIComponent(spec.title)}!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 font-medium flex items-center gap-2 text-sm uppercase tracking-wider group-hover:gap-3 transition-all"
                >
                  Saiba mais <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1">
            <h2 className="text-3xl font-serif text-stone-900 mb-6">Sobre Mim</h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Olá! Sou a <strong>{psico.name}</strong>, psicóloga clínica apaixonada por
                compreender a complexidade humana e promover o bem-estar emocional.
              </p>
              <p>
                Acredito que a terapia é um processo colaborativo, onde construímos juntos as
                ferramentas necessárias para que você possa lidar com os desafios da vida de forma
                mais consciente e equilibrada.
              </p>
              <p>
                Minha prática é pautada na ética, no sigilo e no respeito à individualidade de
                cada pessoa que chega ao consultório.
              </p>
            </div>
            <div className="pt-8 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-stone-900 text-2xl">Formação</h4>
                <p className="text-stone-500 text-sm">Bacharel em Psicologia</p>
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-lg">{psico.crp}</h4>
                <p className="text-stone-500 text-sm capitalize">{psico.crpStatus}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2 relative">
            <img
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800"
              alt="Ambiente de consultório"
              className="rounded-3xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* AI Reflexão Section */}
      <section className="py-24 bg-stone-100 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-stone-900">Primeiro Passo ✨</h2>
            </div>

            <p className="text-stone-600 mb-8 leading-relaxed">
              Às vezes é difícil saber por onde começar na terapia. Experimente descrever em uma
              frase como você tem se sentido ultimamente, e nossa IA de acolhimento ajudará você a
              refletir.
            </p>

            <div className="relative mb-6">
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Ex: Tenho me sentido muito cansado e sem motivação no trabalho..."
                className="w-full p-6 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none italic text-stone-700 pr-20"
                rows="3"
              />
              <button
                onClick={handleGeminiReflection}
                disabled={isLoadingAi || !reflectionText.trim()}
                className="absolute bottom-4 right-4 bg-teal-700 text-white p-3 rounded-xl hover:bg-teal-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-700/20 flex items-center gap-2"
                aria-label="Enviar reflexão"
              >
                {isLoadingAi ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {aiResponse && (
              <div className="p-6 bg-teal-50 border border-teal-100 rounded-2xl">
                <p className="text-teal-900 leading-relaxed italic">"{aiResponse}"</p>
                <p className="mt-4 text-xs text-teal-600 font-medium uppercase tracking-wider">
                  — Sugestão de reflexão para sua sessão
                </p>
              </div>
            )}

            {errorAi && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorAi}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-teal-900 text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif mb-8">Vamos conversar?</h2>
          <p className="text-teal-100 mb-12 text-lg">
            Sinta-se à vontade para entrar em contato. Responderei o mais breve possível.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <a
              href={`https://wa.me/${psico.whatsapp}?text=Olá%20Luana%2C%20gostaria%20de%20agendar%20uma%20consulta!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-teal-800/50 p-6 rounded-2xl text-left border border-teal-700 hover:bg-teal-800 transition-all"
            >
              <div className="p-3 bg-teal-700 rounded-xl">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-teal-200 text-xs uppercase tracking-widest font-bold">
                  WhatsApp
                </p>
                <p className="font-medium">{psico.whatsappDisplay}</p>
              </div>
            </a>
            <a
              href={`mailto:${psico.email}`}
              className="flex items-center gap-4 bg-teal-800/50 p-6 rounded-2xl text-left border border-teal-700 hover:bg-teal-800 transition-all"
            >
              <div className="p-3 bg-teal-700 rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-teal-200 text-xs uppercase tracking-widest font-bold">E-mail</p>
                <p className="font-medium">{psico.email}</p>
              </div>
            </a>
          </div>

          <div className="bg-white text-stone-900 p-8 rounded-3xl shadow-2xl max-w-lg mx-auto">
            <h3 className="text-xl font-bold mb-6">Envie uma mensagem</h3>

            {formStatus === 'success' ? (
              <div className="py-8 flex flex-col items-center gap-4 text-teal-700">
                <CheckCircle className="w-12 h-12" />
                <p className="font-semibold text-lg">Mensagem enviada!</p>
                <p className="text-stone-500 text-sm">Luana entrará em contato em breve.</p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="mt-2 text-sm text-teal-600 underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  placeholder="Seu Nome"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Seu E-mail"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
                <textarea
                  placeholder="Conte um pouco sobre o que você busca na terapia..."
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                />
                {formStatus === 'error' && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Erro ao enviar. Tente pelo WhatsApp ou e-mail.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full bg-teal-700 text-white py-4 rounded-xl font-bold hover:bg-teal-800 transition-all disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                    </>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-stone-50 border-t border-stone-200 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-xl font-serif text-teal-800 font-bold">Psic. {psico.name}</h3>
            <p className="text-stone-500 text-sm mt-1">
              {psico.crp} | Atendimento Online e Presencial
            </p>
            <p className="text-stone-400 text-xs mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {psico.city}
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href={psico.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white shadow-sm rounded-full text-stone-600 hover:text-teal-600 hover:shadow-md transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={psico.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white shadow-sm rounded-full text-stone-600 hover:text-teal-600 hover:shadow-md transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/${psico.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white shadow-sm rounded-full text-stone-600 hover:text-teal-600 hover:shadow-md transition-all"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          <p className="text-stone-400 text-xs text-center md:text-right">
            © {new Date().getFullYear()} Luana Sakovicz. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
