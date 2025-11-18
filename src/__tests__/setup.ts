import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock canvas context
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch API
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: new Headers(),
  json: vi.fn().mockResolvedValue({}),
  text: vi.fn().mockResolvedValue(''),
  blob: vi.fn().mockResolvedValue(new Blob()),
  clone: vi.fn(),
});

// Mock Web APIs
vi.stubGlobal('Notification', vi.fn());
vi.stubGlobal('navigator', {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  userAgent: 'test-agent',
  language: 'en-US',
  languages: ['en-US', 'zh-CN'],
  onLine: true,
  serviceWorker: {
    register: vi.fn().mockResolvedValue(undefined),
    ready: Promise.resolve(),
  },
});

// Mock DOM methods
vi.stubGlobal('scrollTo', vi.fn());
vi.stubGlobal('scrollBy', vi.fn());
vi.stubGlobal('getSelection', vi.fn(() => ({
  removeAllRanges: vi.fn(),
  addRange: vi.fn(),
  toString: vi.fn().mockReturnValue(''),
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock random number generation for consistent test results
Math.random = vi.fn(() => 0.5);

// Mock Date to return consistent values for tests
const mockDate = new Date('2024-01-01T00:00:00.000Z');
vi.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
  if (args.length) {
    return new (vi.getMockedFunction(Date))(args[0]);
  }
  return new Date(mockDate);
});

// Mock crypto API
global.crypto = {
  getRandomValues: vi.fn((array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
  subtle: {
    digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
  },
  randomUUID: vi.fn(() => '00000000-0000-0000-0000-000000000000'),
};

// Mock URL API
global.URL = vi.fn().mockImplementation((url: string, base?: string) => {
  const urlObj = new (vi.getMockedFunction(URL))(url, base);
  return {
    ...urlObj,
    href: url,
    origin: url.startsWith('http') ? new URL(url).origin : '',
    protocol: url.startsWith('http') ? new URL(url).protocol : '',
    hostname: url.startsWith('http') ? new URL(url).hostname : '',
    port: url.startsWith('http') ? new URL(url).port : '',
    pathname: url.startsWith('http') ? new URL(url).pathname : url,
    search: url.startsWith('http') ? new URL(url).search : '',
    hash: url.startsWith('http') ? new URL(url).hash : '',
  };
});

// Mock FormData
class MockFormData {
  private data: Record<string, any> = {};

  append(name: string, value: any) {
    this.data[name] = value;
  }

  get(name: string) {
    return this.data[name];
  }

  getAll(name: string) {
    return [this.data[name]].filter(Boolean);
  }

  has(name: string) {
    return name in this.data;
  }

  delete(name: string) {
    delete this.data[name];
  }

  forEach(callback: (value: any, key: string) => void) {
    Object.entries(this.data).forEach(([key, value]) => callback(value, key));
  }
}
global.FormData = MockFormData as any;

// Mock File API
class MockFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;

  constructor(bits: any[], name: string, options?: FilePropertyBag) {
    this.name = name;
    this.size = bits.reduce((acc, bit) => acc + (bit?.length || 0), 0);
    this.type = options?.type || '';
    this.lastModified = options?.lastModified || Date.now();
  }

  slice(start?: number, end?: number, contentType?: string): Blob {
    return new Blob([], { type: contentType });
  }

  stream(): ReadableStream {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  }

  text(): Promise<string> {
    return Promise.resolve('');
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0));
  }
}
global.File = MockFile as any;

// Mock Blob API
global.Blob = vi.fn().mockImplementation((parts?: any[], options?: BlobPropertyBag) => ({
  size: parts?.reduce((acc, part) => acc + (part?.length || 0), 0) || 0,
  type: options?.type || '',
  slice: vi.fn().mockReturnValue({ size: 0, type: '' }),
  stream: vi.fn().mockReturnValue({
    getReader: vi.fn().mockReturnValue({
      read: vi.fn().mockResolvedValue({ done: true, value: undefined }),
      releaseLock: vi.fn(),
    }),
  }),
  text: vi.fn().mockResolvedValue(''),
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
}));

// Mock DragEvent
global.DragEvent = vi.fn().mockImplementation((type: string, eventInitDict?: DragEventInit) => ({
  type,
  bubbles: eventInitDict?.bubbles || false,
  cancelable: eventInitDict?.cancelable || false,
  dataTransfer: {
    effectAllowed: 'all',
    dropEffect: 'none',
    files: [],
    items: [],
    types: [],
    getData: vi.fn().mockReturnValue(''),
    setData: vi.fn(),
    clearData: vi.fn(),
    setDragImage: vi.fn(),
  },
}));

// Mock Image
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  width = 0;
  height = 0;
  naturalWidth = 0;
  naturalHeight = 0;
  complete = false;
  crossOrigin: string | null = null;
  alt = '';

  constructor() {
    // Auto-trigger load event for testing
    setTimeout(() => {
      this.complete = true;
      this.naturalWidth = 100;
      this.naturalHeight = 100;
      this.width = 100;
      this.height = 100;
      this.onload?.();
    }, 0);
  }
}
global.Image = MockImage as any;

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0, setValueAtTime: vi.fn() },
  }),
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 0, setValueAtTime: vi.fn() },
  }),
  destination: { connect: vi.fn(), disconnect: vi.fn() },
  currentTime: 0,
  close: vi.fn().mockResolvedValue(undefined),
}));

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation((url: string) => ({
  url,
  readyState: WebSocket.CONNECTING,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock Worker
global.Worker = vi.fn().mockImplementation((scriptURL: string) => ({
  postMessage: vi.fn(),
  terminate: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock IndexedDB
global.indexedDB = {
  open: vi.fn().mockReturnValue({
    result: {
      createObjectStore: vi.fn(),
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          add: vi.fn().mockReturnValue({ result: undefined }),
          put: vi.fn().mockReturnValue({ result: undefined }),
          get: vi.fn().mockReturnValue({ result: undefined }),
          delete: vi.fn().mockReturnValue({ result: undefined }),
          clear: vi.fn().mockReturnValue({ result: undefined }),
        }),
        done: Promise.resolve(),
      }),
    },
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
  }),
  deleteDatabase: vi.fn().mockReturnValue({ result: undefined }),
} as any;

// Mock CSS.supports
global.CSS = {
  supports: vi.fn().mockReturnValue(true),
};

// Mock getComputedStyle
global.getComputedStyle = vi.fn().mockReturnValue({
  getPropertyValue: vi.fn().mockReturnValue(''),
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  toJSON: vi.fn(),
}));

// Mock focus management
global.focus = vi.fn();
global.blur = vi.fn();

// Mock alert, confirm, prompt
global.alert = vi.fn();
global.confirm = vi.fn().mockReturnValue(true);
global.prompt = vi.fn().mockReturnValue('test input');

// Mock print
global.print = vi.fn();

// Mock open
global.open = vi.fn().mockReturnValue({
  document: { write: vi.fn(), close: vi.fn() },
  close: vi.fn(),
  focus: vi.fn(),
  blur: vi.fn(),
});

// Mock matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock prefers-reduced-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock device memory and connection
Object.defineProperty(navigator, 'deviceMemory', {
  value: 8,
  configurable: true,
});

Object.defineProperty(navigator, 'hardwareConcurrency', {
  value: 4,
  configurable: true,
});

Object.defineProperty(navigator, 'connection', {
  value: {
    effectiveType: '4g',
    saveData: false,
  },
  configurable: true,
});

// Mock visualViewport
Object.defineProperty(window, 'visualViewport', {
  value: {
    scale: 1,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    width: 1920,
    height: 1080,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
  configurable: true,
});

// Mock pageXOffset and pageYOffset
Object.defineProperty(window, 'pageXOffset', { value: 0, writable: true });
Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

// Mock innerWidth and innerHeight
Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });

// Mock screen
Object.defineProperty(window, 'screen', {
  value: {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
    pixelDepth: 24,
    orientation: { angle: 0, type: 'landscape-primary' },
  },
  configurable: true,
});

// Mock devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', { value: 2, writable: true });

// Mock CSS custom properties
CSSStyleDeclaration.prototype.setProperty = vi.fn();
CSSStyleDeclaration.prototype.getPropertyValue = vi.fn().mockReturnValue('');

// Mock transition events
vi.stubGlobal('TransitionEvent', vi.fn().mockImplementation((type: string, eventInitDict?: TransitionEventInit) => ({
  type,
  bubbles: eventInitDict?.bubbles || false,
  cancelable: eventInitDict?.cancelable || false,
  propertyName: eventInitDict?.propertyName || '',
  elapsedTime: eventInitDict?.elapsedTime || 0,
  pseudoElement: eventInitDict?.pseudoElement || '',
}));

// Mock animation events
vi.stubGlobal('AnimationEvent', vi.fn().mockImplementation((type: string, eventInitDict?: AnimationEventInit) => ({
  type,
  bubbles: eventInitDict?.bubbles || false,
  cancelable: eventInitDict?.cancelable || false,
  animationName: eventInitDict?.animationName || '',
  elapsedTime: eventInitDict?.elapsedTime || 0,
  pseudoElement: eventInitDict?.pseudoElement || '',
}));

// Mock custom elements
global.customElements = {
  define: vi.fn(),
  get: vi.fn(),
  whenDefined: vi.fn().mockResolvedValue(undefined),
  upgrade: vi.fn(),
} as any;

// Mock Shadow DOM
Element.prototype.attachShadow = vi.fn().mockReturnValue({
  mode: 'open',
  host: {} as Element,
  innerHTML: '',
  appendChild: vi.fn(),
  removeChild: vi.fn(),
  querySelector: vi.fn(),
  querySelectorAll: vi.fn().mockReturnValue([]),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Mock MutationObserver
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
}));

// Mock PerformanceObserver
global.PerformanceObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
}));

// Mock ReportingObserver
global.ReportingObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock global error handlers
window.addEventListener = vi.fn();
window.removeEventListener = vi.fn();
window.dispatchEvent = vi.fn();

// Mock document methods
document.addEventListener = vi.fn();
document.removeEventListener = vi.fn();
document.dispatchEvent = vi.fn();
document.createElement = vi.fn().mockReturnValue({
  style: {},
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    toggle: vi.fn().mockReturnValue(true),
  },
  appendChild: vi.fn(),
  removeChild: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  setAttribute: vi.fn(),
  getAttribute: vi.fn().mockReturnValue(null),
  querySelector: vi.fn().mockReturnValue(null),
  querySelectorAll: vi.fn().mockReturnValue([]),
  getBoundingClientRect: vi.fn(() => ({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: vi.fn() })),
});

// Mock document.hidden
Object.defineProperty(document, 'hidden', {
  value: false,
  writable: true,
});

// Mock document.visibilityState
Object.defineProperty(document, 'visibilityState', {
  value: 'visible',
  writable: true,
});

// Mock document.readyState
Object.defineProperty(document, 'readyState', {
  value: 'complete',
  writable: true,
});

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  value: '',
  writable: true,
});

// Mock document.title
Object.defineProperty(document, 'title', {
  value: 'Test Page',
  writable: true,
});

// Mock document.URL
Object.defineProperty(document, 'URL', {
  value: 'http://localhost:3000/',
  writable: true,
});

// Mock document.referrer
Object.defineProperty(document, 'referrer', {
  value: '',
  writable: true,
});

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  value: {
    lang: 'en',
    dir: 'ltr',
    style: {},
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn().mockReturnValue(false),
      toggle: vi.fn().mockReturnValue(true),
    },
  },
  writable: true,
});

// Mock document.body
Object.defineProperty(document, 'body', {
  value: {
    style: {},
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn().mockReturnValue(false),
      toggle: vi.fn().mockReturnValue(true),
    },
    appendChild: vi.fn(),
    removeChild: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    querySelector: vi.fn().mockReturnValue(null),
    querySelectorAll: vi.fn().mockReturnValue([]),
    getBoundingClientRect: vi.fn(() => ({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: vi.fn() })),
  },
  writable: true,
});

// Mock head element
const mockHead = {
  appendChild: vi.fn(),
  removeChild: vi.fn(),
  querySelector: vi.fn().mockReturnValue(null),
  querySelectorAll: vi.fn().mockReturnValue([]),
};
Object.defineProperty(document, 'head', {
  value: mockHead,
  writable: true,
});

// Mock meta tags
const mockMetaTags = [
  { name: 'description', content: 'Test description' },
  { property: 'og:title', content: 'Test Title' },
  { property: 'og:description', content: 'Test Description' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
];

mockHead.querySelector.mockImplementation((selector: string) => {
  if (selector === 'meta[name="description"]') {
    return mockMetaTags[0];
  }
  if (selector === 'meta[property="og:title"]') {
    return mockMetaTags[1];
  }
  if (selector === 'meta[property="og:description"]') {
    return mockMetaTags[2];
  }
  if (selector === 'meta[name="viewport"]') {
    return mockMetaTags[3];
  }
  return null;
});

mockHead.querySelectorAll.mockImplementation((selector: string) => {
  if (selector === 'meta') {
    return mockMetaTags;
  }
  return [];
});

// Mock link tags
const mockLinkTags = [
  { rel: 'canonical', href: 'https://example.com/test-page' },
  { rel: 'alternate', hreflang: 'zh-CN', href: 'https://example.com/zh/test-page' },
  { rel: 'alternate', hreflang: 'en-US', href: 'https://example.com/en/test-page' },
];

mockHead.querySelector.mockImplementation((selector: string) => {
  if (selector === 'link[rel="canonical"]') {
    return mockLinkTags[0];
  }
  if (selector === 'link[rel="alternate"][hreflang="zh-CN"]') {
    return mockLinkTags[1];
  }
  if (selector === 'link[rel="alternate"][hreflang="en-US"]') {
    return mockLinkTags[2];
  }
  return null;
});

// Mock script tags
const mockScriptTags = [
  { type: 'application/ld+json', textContent: '{"@context":"https://schema.org","@type":"WebPage"}' },
];

mockHead.querySelector.mockImplementation((selector: string) => {
  if (selector === 'script[type="application/ld+json"]') {
    return mockScriptTags[0];
  }
  return null;
});

// Mock title element
const mockTitle = { textContent: 'Test Page Title' };
mockHead.querySelector.mockImplementation((selector: string) => {
  if (selector === 'title') {
    return mockTitle;
  }
  return null;
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// Global test utilities
global.testUtils = {
  // Mock SEO data generators
  generateMockKeywords: (count: number = 5) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `keyword-${i + 1}`,
      keyword: `test keyword ${i + 1}`,
      density: Math.random() * 5,
      competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      searchVolume: Math.floor(Math.random() * 10000),
      cpc: Math.random() * 10,
      trends: Array.from({ length: 4 }, () => Math.floor(Math.random() * 200)),
      category: ['primary', 'secondary', 'long-tail'][Math.floor(Math.random() * 3)],
      tags: ['important', 'high-volume', 'trending'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  },

  generateMockSitemaps: (count: number = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `sitemap-${i + 1}`,
      name: `Sitemap ${i + 1}`,
      url: `/sitemap-${i + 1}.xml`,
      type: ['xml', 'image', 'video', 'news'][Math.floor(Math.random() * 4)],
      entries: Math.floor(Math.random() * 1000) + 100,
      size: Math.floor(Math.random() * 10000) + 1024,
      lastGenerated: new Date().toISOString(),
      autoSubmit: Math.random() > 0.5,
      searchEngines: ['google', 'bing', 'baidu'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  },

  generateMockMetaTags: (pageUrl: string = '/test-page') => {
    return {
      id: `meta-${Date.now()}`,
      pageUrl,
      title: 'Test Page Title',
      description: 'This is a test page description for SEO purposes.',
      keywords: ['test', 'seo', 'page'],
      author: 'Test Author',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'UTF-8',
      robots: 'index,follow',
      canonical: `https://example.com${pageUrl}`,
      ogTitle: 'Test Page Title - OG',
      ogDescription: 'Test OG description',
      ogImage: 'https://example.com/image.jpg',
      ogType: 'website',
      ogUrl: `https://example.com${pageUrl}`,
      twitterTitle: 'Test Page Title - Twitter',
      twitterDescription: 'Test Twitter description',
      twitterImage: 'https://example.com/twitter-image.jpg',
      twitterCard: 'summary_large_image',
      schemaMarkup: '{"@context":"https://schema.org","@type":"WebPage"}',
      hreflang: [
        { language: 'zh-CN', url: `https://example.com/zh${pageUrl}` },
        { language: 'en-US', url: `https://example.com/en${pageUrl}` },
      ],
      customTags: [{ name: 'custom-tag', content: 'custom-content' }],
      autoGenerate: false,
      lastGenerated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  generateMockAnalysis: (pageUrl: string = '/test-page') => {
    return {
      id: `analysis-${Date.now()}`,
      pageUrl,
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      pageSpeedScore: Math.floor(Math.random() * 30) + 70,
      mobileScore: Math.floor(Math.random() * 30) + 70,
      seoScore: Math.floor(Math.random() * 30) + 70,
      accessibilityScore: Math.floor(Math.random() * 30) + 70,
      bestPracticesScore: Math.floor(Math.random() * 30) + 70,
      issues: [
        {
          type: 'warning',
          category: 'meta-tags',
          message: 'Meta description could be longer',
          suggestion: 'Consider extending the meta description to 150-160 characters',
        },
      ],
      recommendations: [
        {
          category: 'content',
          priority: 'high',
          description: 'Add more internal links',
          impact: 'medium',
        },
      ],
      keywords: [
        {
          keyword: 'test keyword',
          density: Math.random() * 5,
          recommended: 3.0,
          status: 'good',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  generateMockSettings: () => {
    return {
      id: '1',
      siteName: 'Test Blog Site',
      siteDescription: 'A comprehensive blog about technology and SEO',
      siteUrl: 'https://example.com',
      defaultLanguage: 'zh-CN',
      enableMultilingual: true,
      metaTitleTemplate: '{title} | {siteName}',
      metaDescriptionTemplate: '{description}',
      robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/',
      crawlDelay: 1,
      enableCrawlDelay: false,
      sitemapAutoSubmit: true,
      enableAMP: false,
      googleAnalyticsId: 'UA-123456789-1',
      baiduAnalyticsId: 'baidu-123456',
      enableJsonLd: true,
      enableOpenGraph: true,
      enableTwitterCard: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Test helper functions
  waitForAnimation: () => new Promise(resolve => setTimeout(resolve, 16)), // ~60fps
  waitForTimeout: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock API response generators
  createSuccessResponse: (data: any) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: vi.fn().mockResolvedValue({ data, success: true }),
    text: vi.fn().mockResolvedValue(JSON.stringify({ data, success: true })),
  }),

  createErrorResponse: (message: string, status: number = 400) => ({
    ok: false,
    status,
    statusText: message,
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: vi.fn().mockResolvedValue({ error: message, success: false }),
    text: vi.fn().mockResolvedValue(JSON.stringify({ error: message, success: false })),
  }),

  // Performance testing utilities
  measurePerformance: async (fn: () => Promise<any>, iterations: number = 10) => {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
    }
    
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    return { average, min, max, times };
  },

  // Memory testing utilities
  measureMemory: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  },
};

// Extend global type declarations
declare global {
  var testUtils: {
    generateMockKeywords: (count?: number) => any[];
    generateMockSitemaps: (count?: number) => any[];
    generateMockMetaTags: (pageUrl?: string) => any;
    generateMockAnalysis: (pageUrl?: string) => any;
    generateMockSettings: () => any;
    waitForAnimation: () => Promise<void>;
    waitForTimeout: (ms: number) => Promise<void>;
    createSuccessResponse: (data: any) => any;
    createErrorResponse: (message: string, status?: number) => any;
    measurePerformance: (fn: () => Promise<any>, iterations?: number) => Promise<any>;
    measureMemory: () => any;
  };
}

export {};