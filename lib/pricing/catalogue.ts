/**
 * InkMonk Research — Central Pricing Catalogue
 * All amounts stored in PAISE (integer arithmetic, never float)
 * This is the single source of truth for both manual quote flow and AI chatbot
 * 
 * ACCEPTANCE TESTS (from SRS §12):
 * ✓ EN non-tech article 2000 words  = 2000 × 60 paise  = 120000p = ₹1,200
 * ✓ EN tech PPT 10 slides           = 10 × 15000 paise = 150000p = ₹1,500
 * ✓ HI tech article 1000 words      = 1000 × 80 paise  = 80000p  = ₹800
 * ✓ EN tech research paper w/ model = 499900 + 399900   = 899800p = ₹8,998
 * ✓ HI tech thesis w/ model         = 2599900 + 799900  = 3399800p = ₹33,998
 * ✓ Turnitin 3 files                = 3 × 20000 paise  = 60000p  = ₹600
 */

export type Language = 'EN' | 'HI' | 'TURNITIN';
export type WorkType = 'TECH' | 'NON_TECH' | 'NA';
export type PriceType = 'FIXED' | 'PER_WORD' | 'PER_SLIDE' | 'PER_FILE' | 'BUNDLED';

export interface PriceEntry {
  priceType: PriceType;
  amountPaise: number;    // fixed total, per-word rate, per-slide rate, or writing component
  modelPaise?: number;    // bundled model component (for TECH research papers / theses)
  unit?: string;
  isPending?: boolean;    // awaiting business confirmation — do NOT auto-quote
  pendingNote?: string;
}

export interface QuoteRequest {
  language: Language;
  workType?: WorkType;
  service: string;
  package?: string;       // BOOK_100 | BOOK_200 | BOOK_300 | MODEL_SMALL | MODEL_BIG | MODEL_HUGE
  quantity?: number;      // word count | slide count | file count
}

export interface QuoteBreakdown {
  label: string;
  amountPaise: number;
}

export interface QuoteResult {
  totalPaise: number;
  totalFormatted: string;
  breakdown: QuoteBreakdown[];
  isPending?: boolean;
  pendingNote?: string;
}

// ─── Catalogue ────────────────────────────────────────────────────────────────

const CATALOGUE: Record<string, Record<string, Record<string, PriceEntry>>> = {
  EN: {
    NON_TECH: {
      RESEARCH_PAPER: { priceType: 'FIXED',     amountPaise: 499900 },
      REVIEW_PAPER:   { priceType: 'FIXED',     amountPaise: 399900 },
      SYNOPSIS:       { priceType: 'FIXED',     amountPaise: 399900 },
      THESIS:         { priceType: 'FIXED',     amountPaise: 1999900 },
      BOOK:           { priceType: 'FIXED',     amountPaise: 0 }, // resolved by package
      ARTICLE:        { priceType: 'PER_WORD',  amountPaise: 60,    unit: 'word' },
      PPT:            { priceType: 'PER_SLIDE', amountPaise: 12000, unit: 'slide' },
      OTHERS:         { priceType: 'PER_WORD',  amountPaise: 60,    unit: 'word' },
      ASSIGNMENTS:    { priceType: 'PER_WORD',  amountPaise: 60,    unit: 'word', isPending: true, pendingNote: 'Assignment pricing pending confirmation — uses Others rate as working assumption.' },
    },
    TECH: {
      RESEARCH_PAPER: { priceType: 'BUNDLED',   amountPaise: 499900, modelPaise: 399900 },
      REVIEW_PAPER:   { priceType: 'FIXED',     amountPaise: 449900 },
      SYNOPSIS:       { priceType: 'FIXED',     amountPaise: 449900 },
      THESIS:         { priceType: 'BUNDLED',   amountPaise: 2099900, modelPaise: 799900 },
      BOOK:           { priceType: 'FIXED',     amountPaise: 0 }, // resolved by package
      MODEL:          { priceType: 'FIXED',     amountPaise: 0 }, // resolved by package
      ARTICLE:        { priceType: 'PER_WORD',  amountPaise: 70,    unit: 'word' },
      PPT:            { priceType: 'PER_SLIDE', amountPaise: 15000, unit: 'slide' },
      OTHERS:         { priceType: 'PER_WORD',  amountPaise: 70,    unit: 'word' },
      ASSIGNMENTS:    { priceType: 'PER_WORD',  amountPaise: 70,    unit: 'word', isPending: true, pendingNote: 'Assignment pricing pending confirmation — uses Others rate as working assumption.' },
    },
  },
  HI: {
    NON_TECH: {
      RESEARCH_PAPER: { priceType: 'FIXED',     amountPaise: 699900 },
      REVIEW_PAPER:   { priceType: 'FIXED',     amountPaise: 549900 },
      SYNOPSIS:       { priceType: 'FIXED',     amountPaise: 549900 },
      THESIS:         { priceType: 'FIXED',     amountPaise: 2599900 },
      BOOK:           { priceType: 'FIXED',     amountPaise: 0 },
      ARTICLE:        { priceType: 'PER_WORD',  amountPaise: 75,    unit: 'word' },
      PPT:            { priceType: 'PER_SLIDE', amountPaise: 15000, unit: 'slide' },
      OTHERS:         { priceType: 'PER_WORD',  amountPaise: 75,    unit: 'word' },
      ASSIGNMENTS:    { priceType: 'PER_WORD',  amountPaise: 75,    unit: 'word', isPending: true, pendingNote: 'Assignment pricing pending confirmation — uses Others rate as working assumption.' },
    },
    TECH: {
      RESEARCH_PAPER: { priceType: 'BUNDLED',   amountPaise: 699900, modelPaise: 399900 },
      REVIEW_PAPER:   { priceType: 'FIXED',     amountPaise: 599900 },
      SYNOPSIS:       { priceType: 'FIXED',     amountPaise: 599900 },
      THESIS:         { priceType: 'BUNDLED',   amountPaise: 2599900, modelPaise: 799900 },
      BOOK:           { priceType: 'FIXED',     amountPaise: 0 },
      MODEL:          { priceType: 'FIXED',     amountPaise: 0 },
      ARTICLE:        { priceType: 'PER_WORD',  amountPaise: 80,    unit: 'word' },
      PPT:            { priceType: 'PER_SLIDE', amountPaise: 17000, unit: 'slide' },
      OTHERS:         { priceType: 'PER_WORD',  amountPaise: 80,    unit: 'word' },
      ASSIGNMENTS:    { priceType: 'PER_WORD',  amountPaise: 80,    unit: 'word', isPending: true, pendingNote: 'Assignment pricing pending confirmation — uses Others rate as working assumption.' },
    },
  },
  TURNITIN: {
    NA: {
      TURNITIN_REPORT: { priceType: 'PER_FILE', amountPaise: 20000, unit: 'file' },
    },
  },
};

// Book packages (paise)
const BOOK_PACKAGES: Record<string, Record<string, Record<string, number>>> = {
  EN: {
    NON_TECH: { BOOK_100: 399900, BOOK_200: 749900, BOOK_300: 1099900 },
    TECH:     { BOOK_100: 499900, BOOK_200: 849900, BOOK_300: 1199900 },
  },
  HI: {
    NON_TECH: { BOOK_100: 499900, BOOK_200: 949900, BOOK_300: 1399900 },
    TECH:     { BOOK_100: 549900, BOOK_200: 1099900, BOOK_300: 1599900 },
  },
};

// Standalone model packages (same for EN and HI tech)
const MODEL_PACKAGES: Record<string, number> = {
  MODEL_SMALL: 599900,
  MODEL_BIG:   899900,
  MODEL_HUGE:  1299900,
};

// Pending services (not in active catalogue — require confirmation)
export const PENDING_SERVICES = {
  AI_REMOVAL: {
    priceType: 'PER_WORD' as PriceType,
    amountPaise: 35,
    unit: 'word',
    isPending: true,
    pendingNote: 'AI removal service present in earlier catalogue. Awaiting confirmation for revised catalogue.',
  },
  PLAGIARISM_REMOVAL: {
    priceType: 'PER_WORD' as PriceType,
    amountPaise: 40,
    unit: 'word',
    isPending: true,
    pendingNote: 'Plagiarism removal service present in earlier catalogue. Awaiting confirmation for revised catalogue.',
  },
};

// ─── Quote Calculator ─────────────────────────────────────────────────────────

export function calculateQuote(req: QuoteRequest): QuoteResult {
  const { language, workType, service, package: pkg, quantity } = req;

  // Validate
  if (!language) throw new Error('Language is required.');
  if (!service)  throw new Error('Service is required.');

  // Turnitin branch
  if (language === 'TURNITIN') {
    if (!quantity || quantity < 1) throw new Error('Number of files is required.');
    const totalPaise = quantity * 20000;
    return {
      totalPaise,
      totalFormatted: formatPaise(totalPaise),
      breakdown: [
        { label: `Turnitin AI + Plagiarism Report × ${quantity} file${quantity > 1 ? 's' : ''}`, amountPaise: totalPaise },
      ],
    };
  }

  // English / Hindi branch
  const wt = workType || 'NON_TECH';
  const langCatalogue = CATALOGUE[language]?.[wt];
  if (!langCatalogue) throw new Error(`No catalogue for ${language} / ${wt}.`);

  const entry = langCatalogue[service];
  if (!entry) throw new Error(`Service "${service}" not found for ${language} / ${wt}.`);

  // Book service — resolve by package
  if (service === 'BOOK') {
    if (!pkg) throw new Error('Book page package is required (100/200/300 pages).');
    const bookPrice = BOOK_PACKAGES[language]?.[wt]?.[pkg];
    if (!bookPrice) throw new Error(`Book package "${pkg}" not found.`);
    return {
      totalPaise: bookPrice,
      totalFormatted: formatPaise(bookPrice),
      breakdown: [{ label: `Book Writing (${pkg.replace('BOOK_', '')} pages)`, amountPaise: bookPrice }],
      isPending: entry.isPending,
      pendingNote: entry.pendingNote,
    };
  }

  // Model service — resolve by package
  if (service === 'MODEL') {
    if (!pkg) throw new Error('Model size is required (Small/Big/Huge).');
    const modelPrice = MODEL_PACKAGES[pkg];
    if (!modelPrice) throw new Error(`Model package "${pkg}" not found.`);
    const modelLabel: Record<string, string> = {
      MODEL_SMALL: 'Small Model Implementation',
      MODEL_BIG:   'Big Model Implementation',
      MODEL_HUGE:  'Very Huge Model cum Website',
    };
    return {
      totalPaise: modelPrice,
      totalFormatted: formatPaise(modelPrice),
      breakdown: [{ label: modelLabel[pkg] || pkg, amountPaise: modelPrice }],
    };
  }

  // Bundled (Tech Research Paper / Tech Thesis)
  if (entry.priceType === 'BUNDLED') {
    const writingPaise = entry.amountPaise;
    const modelPaise   = entry.modelPaise ?? 0;
    const totalPaise   = writingPaise + modelPaise;
    const serviceLabels: Record<string, string> = {
      RESEARCH_PAPER: 'Research Paper',
      THESIS:         'Thesis',
    };
    const label = serviceLabels[service] || service;
    return {
      totalPaise,
      totalFormatted: formatPaise(totalPaise),
      breakdown: [
        { label: `${label} — Writing Component`, amountPaise: writingPaise },
        { label: `${label} — Model/Implementation Component`, amountPaise: modelPaise },
      ],
    };
  }

  // Fixed price
  if (entry.priceType === 'FIXED') {
    return {
      totalPaise: entry.amountPaise,
      totalFormatted: formatPaise(entry.amountPaise),
      breakdown: [{ label: serviceDisplayName(service), amountPaise: entry.amountPaise }],
      isPending: entry.isPending,
      pendingNote: entry.pendingNote,
    };
  }

  // Per-word / per-slide / per-file
  if (entry.priceType === 'PER_WORD' || entry.priceType === 'PER_SLIDE') {
    if (!quantity || quantity < 1) {
      throw new Error(`${entry.priceType === 'PER_WORD' ? 'Word count' : 'Slide count'} is required.`);
    }
    const totalPaise = Math.round(quantity * entry.amountPaise);
    const rateLabel = entry.priceType === 'PER_WORD'
      ? `${quantity} words × ₹${(entry.amountPaise / 100).toFixed(2)}/word`
      : `${quantity} slides × ₹${(entry.amountPaise / 100).toFixed(0)}/slide`;
    return {
      totalPaise,
      totalFormatted: formatPaise(totalPaise),
      breakdown: [{ label: `${serviceDisplayName(service)} — ${rateLabel}`, amountPaise: totalPaise }],
      isPending: entry.isPending,
      pendingNote: entry.pendingNote,
    };
  }

  throw new Error(`Unknown price type: ${entry.priceType}`);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  // Show as integer if whole number, else 2 decimal places
  if (Number.isInteger(rupees)) {
    return `₹${rupees.toLocaleString('en-IN')}`;
  }
  return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function serviceDisplayName(service: string): string {
  const names: Record<string, string> = {
    RESEARCH_PAPER: 'Research Paper Writing',
    REVIEW_PAPER:   'Review Paper Writing',
    SYNOPSIS:       'Synopsis Writing',
    THESIS:         'Thesis Writing',
    BOOK:           'Book Writing',
    ARTICLE:        'Article Writing',
    PPT:            'PPT Making',
    OTHERS:         'Other Work',
    ASSIGNMENTS:    'Assignment Writing',
    MODEL:          'Model Implementation',
    TURNITIN_REPORT:'Turnitin AI + Plagiarism Report',
  };
  return names[service] || service;
}

// ─── Service Lists for UI ─────────────────────────────────────────────────────

export const SERVICES_BY_CATEGORY: Record<string, string[]> = {
  'EN_NON_TECH': ['RESEARCH_PAPER', 'REVIEW_PAPER', 'SYNOPSIS', 'THESIS', 'BOOK', 'ARTICLE', 'PPT', 'ASSIGNMENTS', 'OTHERS'],
  'EN_TECH':     ['RESEARCH_PAPER', 'REVIEW_PAPER', 'SYNOPSIS', 'THESIS', 'BOOK', 'MODEL', 'ARTICLE', 'PPT', 'ASSIGNMENTS', 'OTHERS'],
  'HI_NON_TECH': ['RESEARCH_PAPER', 'REVIEW_PAPER', 'SYNOPSIS', 'THESIS', 'BOOK', 'ARTICLE', 'PPT', 'ASSIGNMENTS', 'OTHERS'],
  'HI_TECH':     ['RESEARCH_PAPER', 'REVIEW_PAPER', 'SYNOPSIS', 'THESIS', 'BOOK', 'MODEL', 'ARTICLE', 'PPT', 'ASSIGNMENTS', 'OTHERS'],
  'TURNITIN':    ['TURNITIN_REPORT'],
};

export const SERVICE_DISPLAY_NAMES: Record<string, string> = {
  RESEARCH_PAPER:  'Research Paper Writing',
  REVIEW_PAPER:    'Review Paper Writing',
  SYNOPSIS:        'Synopsis Writing',
  THESIS:          'Thesis Writing',
  BOOK:            'Book Writing',
  MODEL:           'Standalone Model Implementation',
  ARTICLE:         'Article Writing',
  PPT:             'PPT Making',
  ASSIGNMENTS:     'Assignment Writing',
  OTHERS:          'Other Work',
  TURNITIN_REPORT: 'Turnitin AI + Plagiarism Report',
};

export const BOOK_PACKAGE_LABELS: Record<string, string> = {
  BOOK_100: '100 Pages',
  BOOK_200: '200 Pages',
  BOOK_300: '300 Pages',
};

export const MODEL_PACKAGE_LABELS: Record<string, string> = {
  MODEL_SMALL: 'Small Model Implementation',
  MODEL_BIG:   'Big Model Implementation',
  MODEL_HUGE:  'Very Huge Model cum Website',
};

// Which services need quantity input
export const REQUIRES_WORD_COUNT = new Set(['ARTICLE', 'OTHERS', 'ASSIGNMENTS']);
export const REQUIRES_SLIDE_COUNT = new Set(['PPT']);
export const REQUIRES_BOOK_PACKAGE = new Set(['BOOK']);
export const REQUIRES_MODEL_PACKAGE = new Set(['MODEL']);
export const REQUIRES_FILE_COUNT = new Set(['TURNITIN_REPORT']);
