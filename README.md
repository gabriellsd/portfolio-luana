# Portfolio — Luana Sakovicz | Psicóloga Clínica

Site de apresentação profissional da psicóloga Luana Sakovicz.  
**URL em produção:** https://portfolio-luana.vercel.app

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | Framework principal |
| Vite | 6 | Build e dev server |
| Tailwind CSS | 3 | Estilização |
| Lucide React | 0.468 | Ícones |

---

## Pré-requisitos

- [Node.js](https://nodejs.org) v18 ou superior
- Git configurado com acesso ao repositório

---

## Instalação em um novo computador

```bash
# 1. Clonar o repositório
git clone https://github.com/gabriellsd/portfolio-luana.git
cd portfolio-luana

# 2. Instalar dependências
npm install

# 3. Criar arquivo de variáveis de ambiente
cp .env.example .env
# Abrir o .env e preencher as chaves (ver seção abaixo)

# 4. Rodar localmente
npm run dev
# Abre em http://localhost:5173
```

---

## Variáveis de Ambiente (`.env`)

```env
VITE_GEMINI_API_KEY=   # Chave da API do Google Gemini (aistudio.google.com)
VITE_FORMSPREE_ID=     # ID do formulário Formspree (formspree.io) — não usado atualmente
```

> O arquivo `.env` **não vai para o Git** (está no `.gitignore`).  
> Na Vercel, as variáveis ficam em: **Settings → Environment Variables**.

---

## Estrutura do Projeto

```
portfolio-luana/
├── public/
│   ├── favicon.svg          # Ícone da aba do navegador
│   ├── luana-livro.png      # Foto do Hero (retrato, jaleco, braços cruzados)
│   └── luana-retrato.png    # Foto do Sobre Mim (segurando livro)
├── src/
│   ├── App.jsx              # Componente principal — toda a UI está aqui
│   ├── main.jsx             # Entry point do React
│   ├── index.css            # Tailwind + estilos das animações de scroll
│   └── useReveal.js         # Hook de animação com Intersection Observer
├── index.html               # Entry point do Vite (meta tags, SEO, Open Graph)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json              # Configuração de deploy na Vercel
└── .env.example             # Modelo das variáveis de ambiente
```

---

## Dados da Psicóloga

Todos os dados ficam no objeto `psico` no topo de `src/App.jsx`:

```js
const psico = {
  name: 'Luana Sakovicz',
  crp: 'CRP 06/123456',        // ← atualizar quando o CRP sair
  crpStatus: 'em processo de registro',
  whatsapp: '5541991369954',   // formato: 55 + DDD + número (sem símbolos)
  whatsappDisplay: '(41) 99136-9954',
  email: 'luana.sakovicz@gmail.com',
  instagram: 'https://www.instagram.com/lu_sakovicz',
  linkedin: 'https://www.linkedin.com/in/luana-sakovicz-353b7111b',
  city: 'Campo Largo, PR',
};
```

---

## Seções do Site (em ordem)

1. **Hero** — título, descrição e foto (`luana-livro.png`)
2. **Serviços** — 3 cards de áreas de atuação
3. **Sobre Mim** — bio, formação, CRP e foto (`luana-retrato.png`)
4. **Minha Abordagem** — 3 pilares: escuta, ética e evidências
5. **FAQ** — 6 perguntas com acordeão
6. **Localização** — cards + mapa do Google Maps embutido
7. **Contato** — cards de WhatsApp e e-mail
8. **Footer** — links das redes sociais

---

## Como fazer alterações comuns

### Atualizar o CRP
Em `src/App.jsx`, alterar:
```js
crp: 'CRP 06/XXXXXX',
crpStatus: 'registro profissional ativo',
```

### Trocar uma foto
1. Colocar a nova imagem em `public/`
2. Atualizar o `src` correspondente em `src/App.jsx`

### Adicionar uma pergunta no FAQ
Em `src/App.jsx`, adicionar um objeto no array `faqs`:
```js
{
  question: 'Sua pergunta aqui?',
  answer: 'Resposta aqui.',
},
```

### Mudar cor principal
O tema usa `teal` do Tailwind. Para trocar, substituir todas as classes `teal` por outra cor (ex: `violet`, `emerald`, `sky`) em `src/App.jsx`.

---

## Deploy

O deploy é automático: toda vez que um commit é feito no branch `main`, a Vercel detecta e faz o redeploy automaticamente.

### Deploy manual (se necessário)
```bash
npm run build      # Gera a pasta dist/
# Fazer upload da pasta dist/ manualmente na Vercel
```

### Acessar o painel da Vercel
https://vercel.com/gabriellsd/portfolio-luana

---

## Backups (tags Git)

| Tag | Descrição |
|-----|-----------|
| `v1.0` | Site completo sem fotos reais |
| `v1.1` | Fotos reais da Luana + SEO + animações |

```bash
# Voltar para um backup
git checkout v1.1
```

---

## Repositório GitHub

https://github.com/gabriellsd/portfolio-luana
