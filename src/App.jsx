import React, { useState, useEffect } from 'react';
import { useReveal } from './useReveal';
import {
  MessageCircle,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Menu,
  X,
  ChevronRight,
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
    emoji: '🧸',
    title: 'Crianças',
    description:
      'O atendimento infantil é realizado de forma lúdica, utilizando o brincar como principal linguagem da criança. Também ofereço orientação aos pais e responsáveis, que são parceiros fundamentais nesse processo.',
  },
  {
    emoji: '🌱',
    title: 'Adolescentes',
    description:
      'A adolescência é uma fase de grandes transformações — identidade, pertencimento, relacionamentos e pressões do dia a dia. Ofereço um espaço de escuta sem julgamentos para atravessar esse período com mais segurança.',
  },
  {
    emoji: '🌿',
    title: 'Adultos',
    description:
      'Atendimento voltado para ansiedade, autoconhecimento, autoestima, relacionamentos e os desafios da vida adulta. Um espaço para se reconectar consigo mesmo e construir uma vida mais equilibrada.',
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
    question: 'O atendimento é presencial ou online?',
    answer:
      'Ofereço as duas modalidades! O atendimento presencial acontece em Campo Largo (PR). O online é realizado por videochamada e atende pacientes de todo o Brasil, com a mesma qualidade e sigilo de uma sessão presencial.',
  },
  {
    question: 'Quanto tempo dura cada sessão?',
    answer:
      'As sessões têm duração de 50 minutos, seguindo o padrão da hora-sessão definido pelo Conselho Federal de Psicologia (CFP).',
  },
  {
    question: 'Com que frequência acontecem as sessões?',
    answer:
      'A frequência padrão é semanal — uma sessão por semana. Essa regularidade é importante para que o processo terapêutico tenha continuidade e profundidade. Em alguns casos, pode ser ajustada conforme a necessidade.',
  },
  {
    question: 'Para quem é o atendimento?',
    answer:
      'Atendo crianças, adolescentes e adultos. Cada faixa etária tem uma abordagem adaptada: com crianças o trabalho é lúdico; com adolescentes o foco é na escuta e identidade; com adultos trabalhamos ansiedade, autoconhecimento, relacionamentos e muito mais.',
  },
  {
    question: 'Como faço para agendar uma consulta?',
    answer:
      'O agendamento é feito diretamente pelo WhatsApp. É só mandar uma mensagem e combinamos juntos o melhor dia e horário para você.',
  },
  {
    question: 'Você atende pelo plano de saúde?',
    answer:
      'No momento, os atendimentos são realizados de forma particular. Entre em contato pelo WhatsApp para saber mais sobre os valores e possibilidades de pagamento.',
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
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bc5a] text-white p-4 rounded-full shadow-xl shadow-green-500/30 transition-all hover:scale-110 flex items-center gap-2 group"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
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
            <div className="w-64 h-80 md:w-80 md:h-[480px] bg-teal-100 rounded-[40px] rotate-6 absolute -z-10"></div>
            <div className="w-64 h-80 md:w-80 md:h-[480px] bg-stone-200 rounded-[40px] overflow-hidden shadow-2xl">
              <img
                src="/luana-livro.png"
                alt="Luana Sakovicz — Psicóloga Clínica"
                className="w-full h-full object-cover object-center"
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
            <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Sou psicóloga com atuação clínica, oferecendo atendimento para crianças, adolescentes e adultos.
              Acredito em uma escuta sensível, ética e acolhedora, respeitando o tempo e a singularidade de cada pessoa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {specialties.map((spec, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-stone-50 hover:bg-teal-50 border border-stone-100 transition-all group"
              >
                <div className="text-4xl mb-6">{spec.emoji}</div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800">{spec.title}</h3>
                <p className="text-stone-600 leading-relaxed mb-6">{spec.description}</p>
                <a
                  href={`https://wa.me/${psico.whatsapp}?text=Olá%20Luana%2C%20tenho%20interesse%20em%20atendimento%20para%20${encodeURIComponent(spec.title)}!`}
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
              src="/luana-retrato.png"
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
