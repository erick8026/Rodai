const translations = {
  es: {
    navServices: 'Servicios', navHow: 'Cómo funciona', navBrochures: 'Brochures', navContact: 'Contacto', navCTA: 'Solicitar demo',
    eyebrow: 'Automatización de ventas por WhatsApp con IA',
    heroTitle: 'Convierte conversaciones en ventas automáticas para tu negocio.',
    heroText: 'Implementamos sistemas que responden clientes, atienden 24/7 y generan oportunidades comerciales por WhatsApp usando inteligencia artificial.',
    heroCTA1: 'Hablar por WhatsApp', heroCTA2: 'Ver servicios',
    heroPoint1: 'Respuestas automáticas 24/7', heroPoint2: 'Captura de leads', heroPoint3: 'Implementación rápida',
    miniLabel: 'Canal principal',
    problemEyebrow: 'El problema', problemTitle: 'Muchas empresas pierden clientes por no responder a tiempo.', problemText: 'RODAI automatiza la atención y el seguimiento para que tu negocio no dependa de responder manualmente cada mensaje.',
    problemBox1Title: 'Sin automatización', problemBox1Text: 'Mensajes sin responder, clientes fríos, procesos manuales y oportunidades perdidas.',
    problemBox2Title: 'Con RODAI', problemBox2Text: 'Atención inmediata, identificación de interesados, captura de datos y más ventas.',
    servicesEyebrow: 'Servicios', servicesTitle: 'Dos soluciones claras para vender mejor.',
    liaTitle: 'Automatización de respuestas frecuentes', liaText: 'Ideal para negocios que quieren atender automáticamente a sus clientes y responder dudas frecuentes por WhatsApp.',
    liaItem1: 'Chatbot con inteligencia artificial', liaItem2: 'Integración con WhatsApp', liaItem3: 'Respuestas automáticas', liaItem4: 'Entrenamiento inicial, monitoreo y mantenimiento', liaCap: 'Capacidad: 200 conversaciones mensuales',
    elianTitle: 'Automatización + generación de oportunidades', elianText: 'Pensado para empresas que además de responder quieren identificar prospectos y convertir conversaciones en leads.',
    elianItem1: 'Todo lo incluido en Lia Rodai', elianItem2: 'Identificación de clientes interesados', elianItem3: 'Captura automática de datos', elianItem4: 'Generación de leads para el negocio', elianCap: 'Capacidad: 500 conversaciones mensuales',
    downloadBrochure: 'Descargar brochure', stepsEyebrow: 'Cómo funciona', stepsTitle: 'Un sistema simple que trabaja por ti.',
    step1Title: 'Recibe mensajes', step1Text: 'Tus clientes escriben por WhatsApp en cualquier momento.',
    step2Title: 'Responde automáticamente', step2Text: 'La IA atiende preguntas frecuentes y guía la conversación.',
    step3Title: 'Captura datos', step3Text: 'El sistema detecta interés y guarda nombre, teléfono o correo.',
    step4Title: 'Te entrega oportunidades', step4Text: 'Tu negocio recibe leads listos para seguimiento comercial.',
    brochuresEyebrow: 'Material comercial', brochuresTitle: 'Brochures listos en español e inglés.',
    brochureLiaText: 'Automatización de preguntas frecuentes.', brochureElianText: 'Generación de leads y oportunidades.', brochureEnText: 'English brochures for international outreach.',
    ctaEyebrow: 'Listo para publicar', ctaTitle: 'Solicita una demo y empecemos a convertir mensajes en ventas.', ctaButton: 'Escribir por WhatsApp',
    footerText: 'Automatización de ventas por WhatsApp con inteligencia artificial.', footerContact: 'Contacto', footerAssets: 'Archivos'
  },
  en: {
    navServices: 'Services', navHow: 'How it works', navBrochures: 'Brochures', navContact: 'Contact', navCTA: 'Request demo',
    eyebrow: 'AI-powered WhatsApp sales automation',
    heroTitle: 'Turn conversations into automatic sales for your business.',
    heroText: 'We implement systems that answer customers, operate 24/7, and generate sales opportunities on WhatsApp using artificial intelligence.',
    heroCTA1: 'Chat on WhatsApp', heroCTA2: 'View services',
    heroPoint1: '24/7 automated replies', heroPoint2: 'Lead capture', heroPoint3: 'Fast implementation',
    miniLabel: 'Main channel',
    problemEyebrow: 'The problem', problemTitle: 'Many businesses lose customers because they do not reply on time.', problemText: 'RODAI automates customer attention and follow-up so your business does not depend on manually answering every message.',
    problemBox1Title: 'Without automation', problemBox1Text: 'Unanswered messages, cold prospects, manual processes, and lost opportunities.',
    problemBox2Title: 'With RODAI', problemBox2Text: 'Immediate attention, interested prospect detection, contact capture, and more sales.',
    servicesEyebrow: 'Services', servicesTitle: 'Two clear solutions to help you sell better.',
    liaTitle: 'Frequently asked questions automation', liaText: 'Ideal for businesses that want to automatically assist customers and answer common questions on WhatsApp.',
    liaItem1: 'AI-powered chatbot', liaItem2: 'WhatsApp integration', liaItem3: 'Automated responses', liaItem4: 'Initial training, monitoring, and maintenance', liaCap: 'Capacity: 200 monthly conversations',
    elianTitle: 'Automation + opportunity generation', elianText: 'Designed for companies that want more than answers: they want to identify prospects and turn conversations into leads.',
    elianItem1: 'Everything included in Lia Rodai', elianItem2: 'Interested customer identification', elianItem3: 'Automatic contact data capture', elianItem4: 'Lead generation for your business', elianCap: 'Capacity: 500 monthly conversations',
    downloadBrochure: 'Download brochure', stepsEyebrow: 'How it works', stepsTitle: 'A simple system that works for you.',
    step1Title: 'Receive messages', step1Text: 'Your customers write on WhatsApp anytime.',
    step2Title: 'Reply automatically', step2Text: 'The AI handles FAQs and guides the conversation.',
    step3Title: 'Capture data', step3Text: 'The system detects interest and saves name, phone, or email.',
    step4Title: 'Deliver opportunities', step4Text: 'Your business receives leads ready for sales follow-up.',
    brochuresEyebrow: 'Sales material', brochuresTitle: 'Brochures ready in Spanish and English.',
    brochureLiaText: 'FAQ automation.', brochureElianText: 'Lead generation and opportunities.', brochureEnText: 'English brochures for international outreach.',
    ctaEyebrow: 'Ready to launch', ctaTitle: 'Request a demo and let us turn messages into sales.', ctaButton: 'Message on WhatsApp',
    footerText: 'AI-powered WhatsApp sales automation.', footerContact: 'Contact', footerAssets: 'Files'
  }
};

let currentLang = 'es';
const toggle = document.getElementById('langToggle');

function render(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  toggle.textContent = lang === 'es' ? 'EN' : 'ES';
}

toggle.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  render(currentLang);
});

// Chatbot local (simulado)
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotBody = document.getElementById('chatbotBody');

function addChat(message, role) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  bubble.textContent = message;
  chatbotBody.appendChild(bubble);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function botResponse(text) {
  text = text.toLowerCase().trim();
  if (text.includes('precio') || text.includes('costo')) {
    return 'Nuestros planes empiezan desde $49/mes con configuración rápida y soporte. ¿Quieres que te envíe el brochure?';
  }
  if (text.includes('demo') || text.includes('prueba')) {
    return 'Te comparto el link para demo: https://wa.me/50363143273';
  }
  if (text.includes('whatsapp') || text.includes('contacto')) {
    return 'Puedes escribirnos en WhatsApp al +503 6314 3273 o por email info@rodai.io.';
  }
  if (text.length === 0) {
    return 'Por favor, escribe algo para poder ayudarte.';
  }
  return 'Gracias por tu mensaje. Un asesor humano te contactará en breve.';
}

chatbotToggle.addEventListener('click', () => {
  chatbotWindow.classList.toggle('open');
  const isOpen = chatbotWindow.classList.contains('open');
  chatbotWindow.setAttribute('aria-hidden', String(!isOpen));
  if (isOpen) chatbotInput.focus();
});

chatbotClose.addEventListener('click', () => {
  chatbotWindow.classList.remove('open');
  chatbotWindow.setAttribute('aria-hidden', 'true');
});

chatbotForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatbotInput.value.trim();
  if (!value) return;

  addChat(value, 'user');
  chatbotInput.value = '';

  setTimeout(() => {
    addChat(botResponse(value), 'bot');
  }, 450);
});

render(currentLang);
