/**
 * InkMonk Research — Rule-Based Chatbot Engine
 * Finite State Machine with NLP keyword classification
 * No API keys, no external AI — fully deterministic and server-side
 */

import { calculateQuote, formatPaise, SERVICES_BY_CATEGORY, SERVICE_DISPLAY_NAMES, BOOK_PACKAGE_LABELS, MODEL_PACKAGE_LABELS, REQUIRES_WORD_COUNT, REQUIRES_SLIDE_COUNT, REQUIRES_BOOK_PACKAGE, REQUIRES_MODEL_PACKAGE } from '@/lib/pricing/catalogue';

export type ChatState =
  | 'INIT'
  | 'LANGUAGE_SELECT'
  | 'DOMAIN_INPUT'
  | 'TECH_SUGGEST'
  | 'TECH_CONFIRM'
  | 'TECH_CLARIFY'
  | 'REQUIREMENTS'
  | 'SERVICE_SELECT'
  | 'BOOK_PACKAGE_SELECT'
  | 'MODEL_PACKAGE_SELECT'
  | 'QUANTITY_INPUT'
  | 'DEADLINE_INPUT'
  | 'CONTACT_NAME'
  | 'CONTACT_EMAIL'
  | 'CONTACT_PHONE'
  | 'SUMMARY'
  | 'DONE'
  // Turnitin branch
  | 'TURNITIN_FILE_COUNT'
  | 'TURNITIN_DEADLINE'
  | 'TURNITIN_INSTRUCTIONS';

export interface ChatContext {
  language?: 'EN' | 'HI' | 'TURNITIN';
  domain?: string;
  workType?: 'TECH' | 'NON_TECH';
  techSuggestion?: 'TECH' | 'NON_TECH' | 'AMBIGUOUS';
  requirements?: string;
  service?: string;
  package?: string;
  quantity?: number;
  deadline?: string;
  name?: string;
  email?: string;
  phone?: string;
  instructions?: string;
  quote?: {
    totalPaise: number;
    totalFormatted: string;
    breakdown: Array<{ label: string; amountPaise: number }>;
  };
  leadSaved?: boolean;
}

export interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
  options?: string[];
  timestamp: number;
}

export interface ChatTurn {
  botMessage: string;
  nextState: ChatState;
  options?: string[];
  context: ChatContext;
  leadData?: Partial<{
    channel: string;
    language: string;
    domain: string;
    workType: string;
    service: string;
    package: string;
    requirements: string;
    deadline: string;
    quantity: number;
    totalPaise: number;
    breakdown: string;
    name: string;
    email: string;
    phone: string;
  }>;
}

// ─── Technical / Non-Technical Keyword Classifier ────────────────────────────

const TECH_KEYWORDS = [
  'machine learning', 'deep learning', 'neural network', 'artificial intelligence',
  ' ai ', 'data science', 'programming', 'code', 'coding', 'algorithm', 'software',
  'application', 'website', 'web development', 'model implementation', 'python',
  'java', 'javascript', 'c++', 'nlp', 'natural language processing', 'computer vision',
  'robotics', 'iot', 'internet of things', 'blockchain', 'cloud computing',
  'data mining', 'big data', 'cybersecurity', 'network security', 'embedded systems',
  'microcontroller', 'arduino', 'raspberry pi', 'computer science', 'cse',
  'information technology', 'signal processing', 'image processing', 'tensorflow',
  'pytorch', 'keras', 'scikit', 'database design', 'system design', 'api development',
  'data analysis', 'statistics model', 'simulation', 'matlab', 'r programming',
  'bioinformatics', 'computational', 'engineering design', 'control systems',
  'vlsi', 'fpga', 'semiconductor', 'circuit design', 'power electronics',
];

const NON_TECH_KEYWORDS = [
  'management', 'marketing', 'history', 'literature', 'sociology', 'psychology',
  'economics', 'finance', 'accounting', 'law', 'legal', 'political science',
  'education', 'philosophy', 'art', 'music', 'geography', 'environmental policy',
  'public health', 'nursing', 'social work', 'anthropology', 'linguistics',
  'journalism', 'communication', 'business strategy', 'hrm', 'human resources',
  'public administration', 'international relations', 'commerce', 'taxation',
  'audit', 'mba', 'bba', 'english literature', 'hindi literature',
  'cultural studies', 'gender studies', 'health management', 'hospital management',
  'tourism', 'hospitality', 'retail', 'supply chain management', 'operations management',
  'corporate governance', 'brand management', 'consumer behaviour', 'research methodology',
  'qualitative research', 'ethnography', 'case study',
];

const AMBIGUOUS_KEYWORDS = [
  'biotechnology', 'biomedical', 'environmental', 'pharmacy', 'chemistry',
  'mathematics', 'statistics', 'physics', 'civil engineering', 'mechanical engineering',
  'agriculture', 'food science', 'marine', 'geology',
];

export type TechSuggestion = 'TECH' | 'NON_TECH' | 'AMBIGUOUS';

export function classifyDomain(domain: string): TechSuggestion {
  const d = ` ${domain.toLowerCase()} `;
  const techScore = TECH_KEYWORDS.filter(k => d.includes(k)).length;
  const nonTechScore = NON_TECH_KEYWORDS.filter(k => d.includes(k)).length;
  const ambiguousScore = AMBIGUOUS_KEYWORDS.filter(k => d.includes(k)).length;

  if (techScore > 0 && techScore > nonTechScore) return 'TECH';
  if (nonTechScore > 0 && nonTechScore > techScore) return 'NON_TECH';
  if (ambiguousScore > 0) return 'AMBIGUOUS';
  if (techScore > 0) return 'TECH';
  if (nonTechScore > 0) return 'NON_TECH';
  return 'AMBIGUOUS';
}

// ─── Service List Helper ──────────────────────────────────────────────────────

function getServiceOptions(language: 'EN' | 'HI', workType: 'TECH' | 'NON_TECH'): string[] {
  const key = `${language}_${workType}`;
  const services = SERVICES_BY_CATEGORY[key] || [];
  return services.map(s => SERVICE_DISPLAY_NAMES[s] || s);
}

function serviceNameToCode(name: string): string | null {
  for (const [code, display] of Object.entries(SERVICE_DISPLAY_NAMES)) {
    if (display.toLowerCase() === name.toLowerCase() || code.toLowerCase() === name.toLowerCase()) {
      return code;
    }
  }
  // Partial match
  for (const [code, display] of Object.entries(SERVICE_DISPLAY_NAMES)) {
    if (display.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(display.toLowerCase().split(' ')[0])) {
      return code;
    }
  }
  return null;
}

// ─── WhatsApp Message Builder ─────────────────────────────────────────────────

export function buildWhatsAppMessage(context: ChatContext): string {
  const lines: string[] = [
    '🙏 Hello InkMonk Research Team!',
    '',
    'I would like to enquire about your services:',
    '',
  ];

  if (context.name)         lines.push(`👤 Name: ${context.name}`);
  if (context.email)        lines.push(`📧 Email: ${context.email}`);
  if (context.phone)        lines.push(`📱 Phone: ${context.phone}`);
  lines.push('');

  if (context.language === 'TURNITIN') {
    lines.push(`📋 Service: Turnitin AI + Plagiarism Report`);
    if (context.quantity) lines.push(`📂 Number of Files: ${context.quantity}`);
    if (context.deadline)  lines.push(`📅 Deadline: ${context.deadline}`);
    if (context.instructions) lines.push(`📝 Instructions: ${context.instructions}`);
  } else {
    const langLabel = context.language === 'EN' ? 'English' : 'Hindi';
    const typeLabel = context.workType === 'TECH' ? 'Technical' : 'Non-Technical';
    if (context.language)     lines.push(`🌐 Language: ${langLabel}`);
    if (context.domain)       lines.push(`🎓 Subject/Domain: ${context.domain}`);
    if (context.workType)     lines.push(`⚙️ Work Type: ${typeLabel}`);
    if (context.service)      lines.push(`📄 Service: ${SERVICE_DISPLAY_NAMES[context.service] || context.service}`);
    if (context.package)      lines.push(`📦 Package: ${BOOK_PACKAGE_LABELS[context.package] || MODEL_PACKAGE_LABELS[context.package] || context.package}`);
    if (context.requirements) lines.push(`📝 Requirements: ${context.requirements}`);
    if (context.quantity)     lines.push(`🔢 Quantity: ${context.quantity}`);
    if (context.deadline)     lines.push(`📅 Deadline: ${context.deadline}`);
  }

  lines.push('');
  if (context.quote) {
    lines.push(`💰 Estimated Quote: ${context.quote.totalFormatted}`);
    if (context.quote.breakdown.length > 1) {
      context.quote.breakdown.forEach(b => {
        lines.push(`   • ${b.label}: ${formatPaise(b.amountPaise)}`);
      });
    }
  }

  lines.push('');
  lines.push('I would like to discuss this further. Please get in touch!');

  return encodeURIComponent(lines.join('\n'));
}

// ─── Main Chat Processor ──────────────────────────────────────────────────────

export function processChat(
  state: ChatState,
  userMessage: string,
  context: ChatContext,
): ChatTurn {
  const msg = userMessage.trim();
  const msgLower = msg.toLowerCase();

  switch (state) {

    // ── Initial greeting ───────────────────────────────────────────────────
    case 'INIT':
    case 'LANGUAGE_SELECT': {
      // Match language choice
      if (msgLower.includes('english') || msgLower === 'en' || msgLower === '1') {
        return {
          botMessage: `Great! You've selected **English Work**. 🎓\n\nPlease type your **academic subject or domain** (e.g., "Machine Learning", "Marketing Management", "Environmental Science").`,
          nextState: 'DOMAIN_INPUT',
          context: { ...context, language: 'EN' },
        };
      }
      if (msgLower.includes('hindi') || msgLower === 'hi' || msgLower === '2') {
        return {
          botMessage: `बढ़िया! आपने **Hindi Work** चुना है। 🎓\n\nPlease type your **academic subject or domain** (e.g., "Machine Learning", "History", "Hindi Literature").`,
          nextState: 'DOMAIN_INPUT',
          context: { ...context, language: 'HI' },
        };
      }
      if (msgLower.includes('turnitin') || msgLower === '3') {
        return {
          botMessage: `📋 **Turnitin AI + Plagiarism Report**\n\nEach report covers one file and costs **₹200 per file**.\n\nHow many files do you need the report for?`,
          nextState: 'TURNITIN_FILE_COUNT',
          context: { ...context, language: 'TURNITIN' },
        };
      }
      // Default welcome
      return {
        botMessage: `👋 Welcome to **InkMonk Research**!\n\n*Research with care. Writing with clarity.*\n\nI'm your quote assistant. To get started, please choose what you need:\n\n1. **English Work** – Research papers, theses, books, articles, PPTs & more in English\n2. **Hindi Work** – Research papers, theses, books, articles, PPTs & more in Hindi\n3. **Turnitin Reports** – AI + Plagiarism detection reports (₹200 per file)`,
        nextState: 'LANGUAGE_SELECT',
        options: ['English Work', 'Hindi Work', 'Turnitin Reports'],
        context,
      };
    }

    // ── Turnitin branch ────────────────────────────────────────────────────
    case 'TURNITIN_FILE_COUNT': {
      const num = parseInt(msg.replace(/[^0-9]/g, ''), 10);
      if (isNaN(num) || num < 1) {
        return {
          botMessage: `Please enter a valid number of files (e.g., 1, 3, 5).`,
          nextState: 'TURNITIN_FILE_COUNT',
          context,
        };
      }
      const totalPaise = num * 20000;
      return {
        botMessage: `Got it — **${num} file${num > 1 ? 's' : ''}** × ₹200 = **₹${(totalPaise / 100).toLocaleString('en-IN')}**.\n\nWhat is your **deadline** for these reports? (e.g., "3 days", "15 Oct 2026")`,
        nextState: 'TURNITIN_DEADLINE',
        context: { ...context, quantity: num },
      };
    }

    case 'TURNITIN_DEADLINE': {
      return {
        botMessage: `Noted. Any specific **instructions** for the reports? (e.g., file format, subject area)\n\nOr type **"No"** to skip.`,
        nextState: 'TURNITIN_INSTRUCTIONS',
        context: { ...context, deadline: msg },
      };
    }

    case 'TURNITIN_INSTRUCTIONS': {
      const instructions = msgLower === 'no' || msgLower === 'none' ? '' : msg;
      return {
        botMessage: `Perfect! May I have your **name** please?`,
        nextState: 'CONTACT_NAME',
        context: { ...context, instructions },
      };
    }

    // ── Domain input ───────────────────────────────────────────────────────
    case 'DOMAIN_INPUT': {
      const suggestion = classifyDomain(msg);
      const newContext = { ...context, domain: msg, techSuggestion: suggestion };

      if (suggestion === 'TECH') {
        return {
          botMessage: `Based on your domain "**${msg}**", this appears to be **Technical** work (likely involving models, code, or implementation).\n\nIs this correct?`,
          nextState: 'TECH_CONFIRM',
          options: ['Yes, Technical', 'No, Non-Technical'],
          context: newContext,
        };
      }
      if (suggestion === 'NON_TECH') {
        return {
          botMessage: `Based on your domain "**${msg}**", this appears to be **Non-Technical** work (primarily writing/research without coding or model implementation).\n\nIs this correct?`,
          nextState: 'TECH_CONFIRM',
          options: ['Yes, Non-Technical', 'No, Technical'],
          context: newContext,
        };
      }
      // Ambiguous
      return {
        botMessage: `I see your domain is "**${msg}**". To ensure I quote you accurately — does your work involve any of the following?\n\n• Coding or programming\n• Machine learning / AI model\n• Website or application development\n• Technical simulation or implementation\n\nOr is it primarily a **written/research document** without such implementation?`,
        nextState: 'TECH_CLARIFY',
        options: ['Yes — involves coding / model / implementation', 'No — primarily written research'],
        context: newContext,
      };
    }

    // ── Tech clarification ─────────────────────────────────────────────────
    case 'TECH_CLARIFY': {
      const isTech = msgLower.includes('yes') || msgLower.includes('coding') || msgLower.includes('model') || msgLower.includes('implementation') || msgLower.includes('technical');
      const workType = isTech ? 'TECH' : 'NON_TECH';
      const label = isTech ? 'Technical' : 'Non-Technical';
      return {
        botMessage: `Confirmed — **${label}** work. 👍\n\nPlease briefly describe your **requirements** (topic, scope, any special instructions):`,
        nextState: 'REQUIREMENTS',
        context: { ...context, workType },
      };
    }

    // ── Tech confirmation ──────────────────────────────────────────────────
    case 'TECH_CONFIRM': {
      let workType: 'TECH' | 'NON_TECH';
      if (msgLower.includes('non') || msgLower.includes('no')) {
        workType = 'NON_TECH';
      } else {
        workType = context.techSuggestion === 'TECH' ? 'TECH' : 'NON_TECH';
        if (msgLower.includes('yes') || msgLower.includes('technical')) {
          workType = msgLower.includes('non') ? 'NON_TECH' : 'TECH';
        }
      }
      const label = workType === 'TECH' ? 'Technical' : 'Non-Technical';
      return {
        botMessage: `Got it — **${label}** work. 👍\n\nPlease briefly describe your **requirements** (topic, scope, any special instructions):`,
        nextState: 'REQUIREMENTS',
        context: { ...context, workType },
      };
    }

    // ── Requirements ───────────────────────────────────────────────────────
    case 'REQUIREMENTS': {
      if (!context.language || context.language === 'TURNITIN') {
        return { botMessage: 'Something went wrong. Please restart the chat.', nextState: 'INIT', context };
      }
      const workType = context.workType || 'NON_TECH';
      const serviceOptions = getServiceOptions(context.language, workType);
      return {
        botMessage: `Thank you! Here are the services available for **${context.language === 'EN' ? 'English' : 'Hindi'} ${workType === 'TECH' ? 'Technical' : 'Non-Technical'}** work:\n\n${serviceOptions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhich service do you need?`,
        nextState: 'SERVICE_SELECT',
        options: serviceOptions,
        context: { ...context, requirements: msg },
      };
    }

    // ── Service selection ──────────────────────────────────────────────────
    case 'SERVICE_SELECT': {
      // Try to match service name or number
      let serviceCode: string | null = null;
      const num = parseInt(msg, 10);
      if (!isNaN(num) && context.language && context.language !== 'TURNITIN') {
        const key = `${context.language}_${context.workType || 'NON_TECH'}`;
        const services = SERVICES_BY_CATEGORY[key] || [];
        if (num >= 1 && num <= services.length) {
          serviceCode = services[num - 1];
        }
      }
      if (!serviceCode) serviceCode = serviceNameToCode(msg);
      if (!serviceCode) {
        return {
          botMessage: `I didn't recognise that service. Please choose a number from the list or type the service name.`,
          nextState: 'SERVICE_SELECT',
          context,
        };
      }

      if (REQUIRES_BOOK_PACKAGE.has(serviceCode)) {
        return {
          botMessage: `You selected **Book Writing**. Which page package do you need?\n\n1. 100 Pages\n2. 200 Pages\n3. 300 Pages`,
          nextState: 'BOOK_PACKAGE_SELECT',
          options: ['100 Pages', '200 Pages', '300 Pages'],
          context: { ...context, service: serviceCode },
        };
      }

      if (REQUIRES_MODEL_PACKAGE.has(serviceCode)) {
        return {
          botMessage: `You selected **Standalone Model Implementation**. Which size?\n\n1. Small Model — ₹5,999\n2. Big Model — ₹8,999\n3. Very Huge Model cum Website — ₹12,999`,
          nextState: 'MODEL_PACKAGE_SELECT',
          options: ['Small Model', 'Big Model', 'Very Huge Model cum Website'],
          context: { ...context, service: serviceCode },
        };
      }

      // Fixed price services — no quantity needed
      if (!REQUIRES_WORD_COUNT.has(serviceCode) && !REQUIRES_SLIDE_COUNT.has(serviceCode)) {
        return {
          botMessage: `Great choice — **${SERVICE_DISPLAY_NAMES[serviceCode]}**. 📅\n\nWhat is your **deadline**? (e.g., "10 days", "20 Oct 2026")`,
          nextState: 'DEADLINE_INPUT',
          context: { ...context, service: serviceCode },
        };
      }

      const unit = REQUIRES_SLIDE_COUNT.has(serviceCode) ? 'slides' : 'words';
      return {
        botMessage: `You selected **${SERVICE_DISPLAY_NAMES[serviceCode]}**. 📝\n\nHow many **${unit}** do you need? (Please enter a number)`,
        nextState: 'QUANTITY_INPUT',
        context: { ...context, service: serviceCode },
      };
    }

    // ── Book package ───────────────────────────────────────────────────────
    case 'BOOK_PACKAGE_SELECT': {
      let pkg: string | null = null;
      if (msgLower.includes('100')) pkg = 'BOOK_100';
      else if (msgLower.includes('200')) pkg = 'BOOK_200';
      else if (msgLower.includes('300')) pkg = 'BOOK_300';
      else if (msg === '1') pkg = 'BOOK_100';
      else if (msg === '2') pkg = 'BOOK_200';
      else if (msg === '3') pkg = 'BOOK_300';

      if (!pkg) {
        return {
          botMessage: `Please choose 100, 200, or 300 pages.`,
          nextState: 'BOOK_PACKAGE_SELECT',
          options: ['100 Pages', '200 Pages', '300 Pages'],
          context,
        };
      }
      return {
        botMessage: `📅 What is your **deadline**? (e.g., "30 days", "15 Nov 2026")`,
        nextState: 'DEADLINE_INPUT',
        context: { ...context, package: pkg },
      };
    }

    // ── Model package ──────────────────────────────────────────────────────
    case 'MODEL_PACKAGE_SELECT': {
      let pkg: string | null = null;
      if (msgLower.includes('small') || msg === '1') pkg = 'MODEL_SMALL';
      else if (msgLower.includes('big') || msg === '2') pkg = 'MODEL_BIG';
      else if (msgLower.includes('huge') || msgLower.includes('website') || msg === '3') pkg = 'MODEL_HUGE';

      if (!pkg) {
        return {
          botMessage: `Please choose: Small, Big, or Very Huge Model.`,
          nextState: 'MODEL_PACKAGE_SELECT',
          options: ['Small Model', 'Big Model', 'Very Huge Model cum Website'],
          context,
        };
      }
      return {
        botMessage: `📅 What is your **deadline**? (e.g., "2 weeks", "1 Nov 2026")`,
        nextState: 'DEADLINE_INPUT',
        context: { ...context, package: pkg },
      };
    }

    // ── Quantity input ─────────────────────────────────────────────────────
    case 'QUANTITY_INPUT': {
      const qty = parseInt(msg.replace(/[^0-9]/g, ''), 10);
      if (isNaN(qty) || qty < 1) {
        return {
          botMessage: `Please enter a valid number (e.g., 2000 for words, 15 for slides).`,
          nextState: 'QUANTITY_INPUT',
          context,
        };
      }
      return {
        botMessage: `Got it — **${qty}** ${REQUIRES_SLIDE_COUNT.has(context.service || '') ? 'slides' : 'words'}. 📅\n\nWhat is your **deadline**? (e.g., "5 days", "30 Oct 2026")`,
        nextState: 'DEADLINE_INPUT',
        context: { ...context, quantity: qty },
      };
    }

    // ── Deadline ───────────────────────────────────────────────────────────
    case 'DEADLINE_INPUT': {
      // Calculate quote
      let quoteResult;
      let quoteError = '';
      try {
        quoteResult = calculateQuote({
          language: context.language!,
          workType: context.workType,
          service: context.service!,
          package: context.package,
          quantity: context.quantity,
        });
      } catch (e: unknown) {
        quoteError = e instanceof Error ? e.message : 'Could not calculate quote.';
      }

      const newContext: ChatContext = {
        ...context,
        deadline: msg,
        quote: quoteResult,
      };

      if (quoteError || !quoteResult) {
        return {
          botMessage: `Deadline noted. However, I couldn't calculate an automatic quote (${quoteError}). Our team will review your requirements and provide a quote shortly.\n\nMay I have your **name** please?`,
          nextState: 'CONTACT_NAME',
          context: newContext,
        };
      }

      let quoteMsg = `✅ **Your Estimated Quote**\n\n`;
      quoteResult.breakdown.forEach(b => {
        quoteMsg += `• ${b.label}: **${formatPaise(b.amountPaise)}**\n`;
      });
      if (quoteResult.breakdown.length > 1) {
        quoteMsg += `\n💰 **Total: ${quoteResult.totalFormatted}**`;
      } else {
        quoteMsg += `\n💰 **Total: ${quoteResult.totalFormatted}**`;
      }

      if (quoteResult.isPending) {
        quoteMsg += `\n\n⚠️ *Note: ${quoteResult.pendingNote}*`;
      }

      quoteMsg += `\n\nThis is an estimated quote. Our team can discuss and finalise the scope with you on WhatsApp.\n\nMay I have your **name** please?`;

      return {
        botMessage: quoteMsg,
        nextState: 'CONTACT_NAME',
        context: newContext,
      };
    }

    // ── Contact collection ─────────────────────────────────────────────────
    case 'CONTACT_NAME': {
      if (msg.length < 2) {
        return { botMessage: `Please enter your full name.`, nextState: 'CONTACT_NAME', context };
      }
      return {
        botMessage: `Thank you, **${msg}**! 😊\n\nMay I have your **email address**?`,
        nextState: 'CONTACT_EMAIL',
        context: { ...context, name: msg },
      };
    }

    case 'CONTACT_EMAIL': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(msg)) {
        return { botMessage: `That doesn't look like a valid email. Please enter a valid email address.`, nextState: 'CONTACT_EMAIL', context };
      }
      return {
        botMessage: `And your **contact number** (with country code, e.g., +91 9876543210)?`,
        nextState: 'CONTACT_PHONE',
        context: { ...context, email: msg },
      };
    }

    case 'CONTACT_PHONE': {
      if (msg.replace(/[^0-9]/g, '').length < 7) {
        return { botMessage: `Please enter a valid contact number.`, nextState: 'CONTACT_PHONE', context };
      }
      const finalCtx: ChatContext = { ...context, phone: msg, leadSaved: true };
      return {
        botMessage: buildSummaryMessage(finalCtx),
        nextState: 'SUMMARY',
        context: finalCtx,
        leadData: buildLeadData(finalCtx),
      };
    }

    // ── Summary / Done ─────────────────────────────────────────────────────
    case 'SUMMARY':
    case 'DONE': {
      return {
        botMessage: `Your enquiry has been saved ✅\n\nClick **"Send My Details on WhatsApp"** to share your requirements with our team, or **"Message InkMonk Directly"** for a general conversation.\n\nWe'll get back to you shortly! 🙏`,
        nextState: 'DONE',
        context,
      };
    }

    default: {
      return {
        botMessage: `👋 Welcome to **InkMonk Research**!\n\n*Research with care. Writing with clarity.*\n\nPlease choose:\n\n1. **English Work**\n2. **Hindi Work**\n3. **Turnitin Reports**`,
        nextState: 'LANGUAGE_SELECT',
        options: ['English Work', 'Hindi Work', 'Turnitin Reports'],
        context: {},
      };
    }
  }
}

// ─── Summary Builder ──────────────────────────────────────────────────────────

function buildSummaryMessage(ctx: ChatContext): string {
  const lines: string[] = ['📋 **Summary of Your Enquiry**\n'];

  if (ctx.name)  lines.push(`👤 **Name:** ${ctx.name}`);
  if (ctx.email) lines.push(`📧 **Email:** ${ctx.email}`);
  if (ctx.phone) lines.push(`📱 **Phone:** ${ctx.phone}`);
  lines.push('');

  if (ctx.language === 'TURNITIN') {
    lines.push(`📋 **Service:** Turnitin AI + Plagiarism Report`);
    if (ctx.quantity) lines.push(`📂 **Files:** ${ctx.quantity}`);
    if (ctx.deadline)  lines.push(`📅 **Deadline:** ${ctx.deadline}`);
    if (ctx.instructions) lines.push(`📝 **Instructions:** ${ctx.instructions}`);
  } else {
    const langLabel = ctx.language === 'EN' ? '🇬🇧 English' : '🇮🇳 Hindi';
    const typeLabel = ctx.workType === 'TECH' ? '⚙️ Technical' : '📝 Non-Technical';
    if (ctx.language)     lines.push(`🌐 **Language:** ${langLabel}`);
    if (ctx.domain)       lines.push(`🎓 **Domain:** ${ctx.domain}`);
    if (ctx.workType)     lines.push(`🔬 **Work Type:** ${typeLabel}`);
    if (ctx.service)      lines.push(`📄 **Service:** ${SERVICE_DISPLAY_NAMES[ctx.service] || ctx.service}`);
    if (ctx.package)      lines.push(`📦 **Package:** ${BOOK_PACKAGE_LABELS[ctx.package] || MODEL_PACKAGE_LABELS[ctx.package] || ctx.package}`);
    if (ctx.quantity)     lines.push(`🔢 **Quantity:** ${ctx.quantity}`);
    if (ctx.requirements) lines.push(`📝 **Requirements:** ${ctx.requirements}`);
    if (ctx.deadline)     lines.push(`📅 **Deadline:** ${ctx.deadline}`);
  }

  lines.push('');
  if (ctx.quote) {
    lines.push(`💰 **Estimated Quote: ${ctx.quote.totalFormatted}**`);
    if (ctx.quote.breakdown.length > 1) {
      ctx.quote.breakdown.forEach(b => lines.push(`   • ${b.label}: ${formatPaise(b.amountPaise)}`));
    }
  }

  lines.push('\n✅ Your enquiry has been saved. Our team will review and confirm the final scope and price with you.');
  lines.push('\n*Please note: Opening WhatsApp does not automatically send the message. You will need to press Send inside WhatsApp.*');

  return lines.join('\n');
}

function buildLeadData(ctx: ChatContext) {
  return {
    channel: 'CHAT',
    language: ctx.language,
    domain: ctx.domain,
    workType: ctx.workType,
    service: ctx.service,
    package: ctx.package,
    requirements: ctx.requirements,
    deadline: ctx.deadline,
    quantity: ctx.quantity,
    totalPaise: ctx.quote?.totalPaise,
    breakdown: ctx.quote ? JSON.stringify(ctx.quote.breakdown) : undefined,
    name: ctx.name,
    email: ctx.email,
    phone: ctx.phone,
  };
}
