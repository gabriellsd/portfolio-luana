import React, { useState, useEffect } from 'react';
import { useReveal } from './useReveal';
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
  Plus,
  Minus,
  Brain,
  Shield,
  Compass,
  Navigation,
} from 'lucide-react';

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
  address: 'Campo Largo, PR — Atendimento Online e Presencial',
  mapsLink: 'https://www.google.com/maps/search/Campo+Largo+PR',
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

const approaches = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Escuta Ativa',
    description:
      'Cada pessoa é única. Meu trabalho começa por ouvir com atenção, sem julgamentos, para compreender sua história e o que te trouxe até aqui.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Ética e Sigilo',
    description:
      'Tudo o que é compartilhado no consultório fica no consultório. O sigilo profissional é a base da relação terapêutica.',
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: 'Baseada em Evidências',
    description:
      'Utilizo abordagens reconhecidas e validadas cientificamente, adaptadas à necessidade de cada paciente.',
  },
];

const faqs = [
  {
    question: 'Como funciona a primeira sessão?',
    answer:
      'A primeira sessão é uma conversa inicial onde nos conhecemos. Você conta um pouco sobre si, sobre o que te trouxe à terapia e o que espera do processo. Não há pressão — é um espaço seguro para você se sentir à vontade.',
  },
  {
    question: 'Você atende pelo plano de saúde?',
    answer:
      'No momento, os atendimentos são realizados de forma particular. Entre em contato pelo WhatsApp para saber mais sobre os valores e possibilidades de pagamento.',
  },
  {
    question: 'Quanto tempo dura a terapia?',
    answer:
      'A duração é individual e depende dos objetivos de cada pessoa. Algumas questões se resolvem em poucos meses; outras demandam um acompanhamento mais longo. O importante é que você sinta progresso no seu próprio ritmo.',
  },
  {
    question: 'Você realiza atendimento online?',
    answer:
      'Sim! Ofereço atendimento tanto presencial em Campo Largo (PR) quanto online para todo o Brasil, com a mesma qualidade e sigilo de uma sessão presencial.',
  },
  {
    question: 'Qual o valor da consulta?',
    answer:
      'Os valores são informados diretamente pelo WhatsApp. O CFP (Conselho Federal de Psicologia) orienta que os honorários sejam negociados de forma personalizada com cada paciente.',
  },
  {
    question: 'Como sei se a terapia está funcionando?',
    answer:
      'Com o tempo você começa a perceber mudanças sutis: reage diferente a situações que antes te travavam, se conhece melhor, tem mais clareza sobre seus sentimentos. Avaliamos juntos o progresso ao longo do processo.',
  },
];

const navLinks = [
  { name: 'Início', href: '#home' },
  { name: 'Sobre', href: '#about' },
  { name: 'Serviços', href: '#services' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contato', href: '#contact' },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const heroRef = useReveal(0);
  const servicesRef = useReveal(0);
  const aboutRef = useReveal(0);
  const approachRef = useReveal(0);
  const faqRef = useReveal(0);
  const locationRef = useReveal(0);
  const contactRef = useReveal(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">

      {/* Botão flutuante WhatsApp */}
      <a
        href={`https://wa.me/${psico.whatsapp}?text=Olá%20Luana%2C%20gostaria%20de%20agendar%20uma%20consulta!`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl shadow-green-500/30 transition-all hover:scale-110 flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium pr-1">
          Fale comigo
        </span>
      </a>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
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
        <div ref={heroRef} className="reveal max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
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
                src="/luana-retrato.png"
                alt="Luana Sakovicz — Psicóloga Clínica"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white px-6">
        <div ref={servicesRef} className="reveal max-w-6xl mx-auto">
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
        <div ref={aboutRef} className="reveal max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
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
              src="/luana-livro.png"
              alt="Luana Sakovicz com livro de Desenvolvimento Humano"
              className="rounded-3xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Abordagem Section */}
      <section className="py-24 bg-white px-6">
        <div ref={approachRef} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-stone-900 mb-4">Minha Abordagem</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              A terapia é um espaço de acolhimento, reflexão e transformação. Estes são os
              princípios que guiam o meu trabalho.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {approaches.map((item, index) => (
              <div key={index} className="text-center p-8">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 mx-auto text-teal-600">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800">{item.title}</h3>
                <p className="text-stone-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-stone-100 px-6">
        <div ref={faqRef} className="reveal max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-stone-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-stone-500">
              Tire suas dúvidas sobre o processo terapêutico antes de dar o primeiro passo.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-stone-50 transition-colors"
                >
                  <span className="font-semibold text-stone-800 pr-4">{faq.question}</span>
                  <span className="flex-shrink-0 text-teal-600">
                    {openFaq === index ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localização Section */}
      <section className="py-24 bg-white px-6">
        <div ref={locationRef} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-900 mb-4">Onde Fica</h2>
            <p className="text-stone-500">
              Atendimento presencial em Campo Largo (PR) e online para todo o Brasil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-stone-50 rounded-2xl">
                <div className="p-3 bg-teal-100 text-teal-700 rounded-xl flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800 mb-1">Atendimento Presencial</h4>
                  <p className="text-stone-500 text-sm">Campo Largo, PR</p>
                  <a
                    href={psico.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 text-sm font-medium hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    Ver no Google Maps <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-stone-50 rounded-2xl">
                <div className="p-3 bg-teal-100 text-teal-700 rounded-xl flex-shrink-0">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800 mb-1">Atendimento Online</h4>
                  <p className="text-stone-500 text-sm">
                    Para todo o Brasil, via plataforma segura de videochamada.
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${psico.whatsapp}?text=Olá%20Luana%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20atendimento!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal-700 text-white px-6 py-3 rounded-full font-medium hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20"
              >
                <MessageCircle className="w-5 h-5" />
                Consultar disponibilidade
              </a>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl h-72 md:h-96">
              <iframe
                title="Localização Campo Largo PR"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115393.54!2d-49.5298!3d-25.4594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce4f6be2a0a53%3A0x4e8e6efa3a3e4b6a!2sCampo%20Largo%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-teal-900 text-white px-6">
        <div ref={contactRef} className="reveal max-w-4xl mx-auto text-center">
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
