import { 
  Code, RefreshCw, Sliders, FileCode, Layers, FileText, 
  Image as ImageIcon, Calculator, Heart, History, Settings, HelpCircle, 
  Trash2, Copy, Check, Sparkles, Download, Upload, CheckCircle, 
  AlertCircle, ArrowRight, ShieldCheck, ChevronRight, Minimize2, Lock
} from 'lucide-react';

export interface FAQItem {
  q: string;
  a: string;
}

export interface ToolMetadata {
  id: string;
  name: string;
  category: 'image-tools' | 'pdf-tools' | 'ai-tools' | 'video-tools' | 'audio-tools' | 'calculators' | 'converters' | 'developer-tools';
  path: string;
  desc: string;
  seoTitle: string;
  seoDesc: string;
  iconName: string;
  features: string[];
  steps: string[];
  benefits: string[];
  faq: FAQItem[];
  formats: string[];
}

export interface CategoryMetadata {
  id: string;
  name: string;
  desc: string;
  path: string;
  iconName: string;
  colorClass: string;
  darkColorClass: string;
}

export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'image-tools',
    name: 'Image Tools',
    desc: 'Compress, resize, convert, and edit images natively in your browser.',
    path: '/image-tools/',
    iconName: 'ImageIcon',
    colorClass: 'bg-blue-50 text-blue-600',
    darkColorClass: 'dark:bg-blue-950/40 dark:text-blue-400'
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    desc: 'Merge, split, and edit PDF files easily without uploading to external servers.',
    path: '/pdf-tools/',
    iconName: 'FileText',
    colorClass: 'bg-indigo-50 text-indigo-600',
    darkColorClass: 'dark:bg-indigo-950/40 dark:text-indigo-400'
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    desc: 'Leverage AI technology to generate content, assets, and remove image backdrops.',
    path: '/ai-tools/',
    iconName: 'Sparkles',
    colorClass: 'bg-pink-50 text-pink-600',
    darkColorClass: 'dark:bg-pink-950/40 dark:text-pink-400'
  },
  {
    id: 'video-tools',
    name: 'Video Tools',
    desc: 'Edit, trim, and convert video files natively in your browser.',
    path: '/video-tools/',
    iconName: 'Video',
    colorClass: 'bg-red-50 text-red-600',
    darkColorClass: 'dark:bg-red-950/40 dark:text-red-400'
  },
  {
    id: 'audio-tools',
    name: 'Audio Tools',
    desc: 'Process, trim, convert and mix audio formats securely.',
    path: '/audio-tools/',
    iconName: 'Music',
    colorClass: 'bg-orange-50 text-orange-600',
    darkColorClass: 'dark:bg-orange-950/40 dark:text-orange-400'
  },
  {
    id: 'calculators',
    name: 'Calculators',
    desc: 'Solve loan calculations, percentage, GST, BMI and scientific equations.',
    path: '/calculators/',
    iconName: 'Calculator',
    colorClass: 'bg-violet-50 text-violet-600',
    darkColorClass: 'dark:bg-violet-950/40 dark:text-violet-400'
  },
  {
    id: 'converters',
    name: 'Converters',
    desc: 'Seamless file, unit, format, and currency conversions in one click.',
    path: '/converters/',
    iconName: 'RefreshCw',
    colorClass: 'bg-emerald-50 text-emerald-600',
    darkColorClass: 'dark:bg-emerald-950/40 dark:text-emerald-400'
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    desc: 'JSON, Regex, hashing, base64 encoding, and debug tools optimized for developers.',
    path: '/developer-tools/',
    iconName: 'Code',
    colorClass: 'bg-slate-50 text-slate-600',
    darkColorClass: 'dark:bg-slate-900/50 dark:text-slate-400'
  }
];

export const TOOLS: ToolMetadata[] = [
  {
    id: 'compress-image',
    name: 'Compress Image',
    category: 'image-tools',
    path: '/image-tools/compress-image/',
    desc: 'Shrink JPG, PNG, and WEBP file sizes while keeping visual quality.',
    seoTitle: 'Free Online Image Compressor — Compress Images Offline | ToolGenic',
    seoDesc: 'Compress JPG, PNG, WEBP and AVIF image files natively in your browser. Maintain custom resolutions, adjust qualities, and protect your privacy.',
    iconName: 'ImageIcon',
    features: [
      '100% Client-side processing — files never leave your system',
      'Batch processing capabilities for multiple images simultaneously',
      'Real-time before/after quality comparison slider',
      'Configure exact file target size in KB/MB',
      'Option to preserve or remove original image EXIF metadata'
    ],
    steps: [
      'Select or drag and drop your image files into the upload area.',
      'Adjust the quality slider or set a target file size.',
      'Optionally specify new pixel width or height to resize.',
      'Click "Apply Scaling & Compress" to execute.',
      'Review statistics and click "Download" to save your optimized files.'
    ],
    benefits: [
      'Saves server bandwidth and speeds up web page load times.',
      'Secures your assets — no external database uploads or processing.',
      'Generates light, mobile-friendly images suitable for email attachments.'
    ],
    faq: [
      { q: 'Is there a limit on file size or image count?', a: 'No, ToolGenic is 100% free with no limits. Since processing happens on your own device, you can compress files of any size.' },
      { q: 'Can I compress PNG images with transparent backgrounds?', a: 'Yes, our engine fully supports transparent PNG format compression.' },
      { q: 'Are my original photos safe?', a: 'Absolutely. All compression calculations are performed in your browser. Your images are never transmitted over the internet.' }
    ],
    formats: ['PNG', 'JPG', 'JPEG', 'WEBP', 'AVIF']
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    category: 'image-tools',
    path: '/image-tools/resize-image/',
    desc: 'Scale images to exact dimensions, aspect ratios, percentages, or pixels.',
    seoTitle: 'Free Image Resizer Online — Scale Dimensions Natively | ToolGenic',
    seoDesc: 'Resize JPEG, PNG, and WEBP images to specific dimensions in pixels, percentages, inches, or mm. Lock aspect ratio or crop to fit instantly.',
    iconName: 'ImageIcon',
    features: [
      'Resize by absolute pixels (px), percentage (%), inches (in) or mm',
      'Optional aspect ratio locking to prevent image distortion',
      'Multiple scaling algorithms (Nearest Neighbor, Bilinear, Bicubic)',
      'Smart crop-to-fit or stretch capabilities'
    ],
    steps: [
      'Upload your image files.',
      'Choose the measurement unit (pixels, percent, etc.)',
      'Input your targeted width and height values.',
      'Check "Lock Aspect Ratio" if you want to scale proportionally.',
      'Click "Apply Resize" and download your scaled image.'
    ],
    benefits: [
      'Easily resize banners for Shopify, YouTube, or social media.',
      'Strict pixel compliance for passport or corporate portal uploads.',
      'Extremely fast local execution with no server delays.'
    ],
    faq: [
      { q: 'Will resizing reduce my image quality?', a: 'Downscaling is generally clean. Upscaling may result in slight pixelation depending on the source resolution.' },
      { q: 'Can I resize multiple images at once?', a: 'Yes, our professional workspace supports multi-file list processing.' }
    ],
    formats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF']
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    category: 'image-tools',
    path: '/image-tools/background-remover/',
    desc: 'Remove image backgrounds automatically to create transparent backgrounds.',
    seoTitle: 'Free Online AI Background Remover — Cutout Backdrops | ToolGenic',
    seoDesc: 'Instantly isolate subjects from background clutter. Use AI-driven client models to render transparent, solid color, or customized banner backdrops.',
    iconName: 'Sparkles',
    features: [
      'Automatic object and portrait edge detection',
      'Add transparent, solid, or gradient backgrounds',
      'Custom brush tool for manual touch-ups and details',
      'Download clean high-resolution assets'
    ],
    steps: [
      'Select your image featuring a clear subject.',
      'Our canvas analyzer extracts the foreground elements.',
      'Choose whether to keep the backdrop transparent or select a solid/gradient color.',
      'Click "Export Image" to download your clean product photo or profile image.'
    ],
    benefits: [
      'Perfect for ecommerce stores, Amazon product listings, and Shopify banners.',
      'Create custom avatar cutouts and transparent vectors instantly.',
      'No subscription or credits required for full-res downloads.'
    ],
    faq: [
      { q: 'Does this run on AI?', a: 'Yes, it uses optimized client-side computer vision segmentation libraries running entirely in your browser.' },
      { q: 'Can I upload complex scenes?', a: 'For best results, upload images with a clear contrast between the subject and the backdrop.' }
    ],
    formats: ['JPG', 'JPEG', 'PNG', 'WEBP']
  },
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    category: 'image-tools',
    path: '/image-tools/passport-photo-maker/',
    desc: 'Generate perfect size passport and visa photos matching official country guidelines.',
    seoTitle: 'Online Passport Photo Maker — Print Ready Layouts | ToolGenic',
    seoDesc: 'Create official passport, visa, PAN, or driving license photos matching dimensions for US, India, UK, and European standards.',
    iconName: 'ImageIcon',
    features: [
      'Auto-crop with standardized guide lines',
      'Select country-specific rules (US, India, UK, Canada, Australia)',
      'Change background color to white, light blue, or custom values',
      'Generate print-ready sheets with multiple photo cards'
    ],
    steps: [
      'Upload a portrait photo with good lighting.',
      'Select the destination country and document type.',
      'Align your eyes and shoulders with the provided overlay guide.',
      'Choose blue, white or original background backdrop.',
      'Download a single photo or a high-resolution printable sheet containing multiple copies.'
    ],
    benefits: [
      'Avoid expensive photo booths and professional processing bills.',
      'Perfect conformity with official standards to prevent application rejection.',
      'Secure document handling — all processing is strictly local.'
    ],
    faq: [
      { q: 'What is the required background for US passports?', a: 'Official US passport regulations require a plain white or off-white background.' },
      { q: 'Can I print these at home?', a: 'Yes, you can download a standard 4x6 print sheet that matches retail printing services.' }
    ],
    formats: ['JPG', 'JPEG', 'PNG']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    category: 'image-tools',
    path: '/image-tools/image-to-pdf/',
    desc: 'Convert folders of JPG, PNG or WebP images into a single formatted PDF file.',
    seoTitle: 'Convert Image to PDF Online — Free Batch Converter | ToolGenic',
    seoDesc: 'Merge multiple JPG, PNG, or WebP images into a single professional PDF document. Set margins, orientations, and custom compression.',
    iconName: 'FileText',
    features: [
      'Combine multiple image files into one sequential PDF',
      'Rearrange and drag pages to change order',
      'Custom margin, page sizing (A4, Letter, Legal) and layout settings',
      'Lossless quality or compressed formats'
    ],
    steps: [
      'Choose or drag-and-drop multiple images.',
      'Sort pages by dragging the thumbnails into your desired order.',
      'Set page size, margin density, and vertical/horizontal layout.',
      'Click "Convert to PDF" to compile.',
      'Download your formatted PDF document.'
    ],
    benefits: [
      'Combine scanned bills or document snapshots into clean PDF sheets.',
      'Create simple portfolio booklets or photo books instantly.',
      'Save storage space with local high-quality rendering.'
    ],
    faq: [
      { q: 'Is there a limit on how many images I can convert?', a: 'No, you can compile dozens of images into a single document without performance issues.' },
      { q: 'Can I rotate individual slides?', a: 'Yes, each image thumbnail has individual rotation controls before compilation.' }
    ],
    formats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'AVIF']
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/merge-pdf/',
    desc: 'Combine multiple PDF files into a single, organized document.',
    seoTitle: 'Free PDF Merger — Merge Multiple PDF Files | ToolGenic',
    seoDesc: 'Combine multiple PDF files in any order. Rotate individual pages, delete duplicates, and export a clean merged document securely.',
    iconName: 'FileText',
    features: [
      'Drag and drop PDF upload',
      'Visual thumbnail page manager',
      'Rotate pages or delete specific index sheets before merging',
      'No file limits or page counts'
    ],
    steps: [
      'Upload two or more PDF files.',
      'Rearrange documents or page nodes as desired.',
      'Rotate or discard unnecessary pages.',
      'Click "Merge PDFs" to build.',
      'Download the final single document instantly.'
    ],
    benefits: [
      'Consolidate tax reports, bank statements, or study manuals.',
      'Combine assignments or professional portfolios without file size blocks.',
      'Guaranteed security — files never leave your web memory.'
    ],
    faq: [
      { q: 'Can I merge password-protected PDFs?', a: 'You will need to unlock password-protected documents before merging them.' },
      { q: 'Will merging compress my text or degrade layouts?', a: 'No, our client merger preserves original text, fonts, and layers cleanly.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/split-pdf/',
    desc: 'Extract specific pages or page ranges from a PDF file.',
    seoTitle: 'Free PDF Splitter — Split PDF Files Online | ToolGenic',
    seoDesc: 'Extract individual pages, separate page ranges (e.g. 1-5, 8), or split a PDF into individual files securely without uploads.',
    iconName: 'FileText',
    features: [
      'Visual page selector grid',
      'Extract custom ranges or compile every page to a separate document',
      'Combine extracted pages into a single output document',
      'Real-time page layout previews'
    ],
    steps: [
      'Upload the PDF file you wish to split.',
      'Select individual pages or input range values (e.g. 2-6).',
      'Choose between "Extract Pages" or "Split into Independent Files".',
      'Click "Process Split" and download your finished files.'
    ],
    benefits: [
      'Quickly extract invoice receipts or book chapters.',
      'Create lighter reference sheets from large master files.',
      'Fully secure browser operations keep your corporate reports private.'
    ],
    faq: [
      { q: 'Can I extract non-consecutive ranges?', a: 'Yes, you can enter comma-separated values like "1, 3, 5-7" to extract exactly what you need.' },
      { q: 'Does splitting affect hyperlinks or bookmarks?', a: 'The tool extracts original layers, maintaining links in standard ranges.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer-tools',
    path: '/developer-tools/json-formatter/',
    desc: 'Pretty print, validate, and minify your JSON data with instant errors.',
    seoTitle: 'Best Online JSON Formatter — Beautify & Validate JSON | ToolGenic',
    seoDesc: 'Format, validate, prettify, and minify JSON data instantly. Enjoy custom spacing indentations, visual syntax validation, and collapsible tree nodes.',
    iconName: 'Code',
    features: [
      'Validate JSON syntax and debug line errors instantly',
      'Formatting with custom spacing indent size',
      'Minification / compact formatting mode',
      'Tree structure view with collapsible parent nodes'
    ],
    steps: [
      'Paste your raw JSON payload, URL parameter, or file string.',
      'The checker validates syntax formatting in real-time.',
      'Click "Format & Validate" or "Minify JSON" to calculate outputs.',
      'Review structural warnings or nested objects.',
      'Click "Copy Output" or "Download File" to complete.'
    ],
    benefits: [
      'Instantly fix broken brackets or commas in network payloads.',
      'Clean print logs or configuration files for better readability.',
      'Completely secure — processes proprietary data locally.'
    ],
    faq: [
      { q: 'Will this format invalid JSON?', a: 'It locates syntax anomalies, highlights line-by-line exceptions, and suggests fixes to render valid structures.' },
      { q: 'What is the maximum payload size?', a: 'Our engine comfortably processes JSON records up to 15MB.' }
    ],
    formats: ['JSON', 'TXT']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'developer-tools',
    path: '/developer-tools/password-generator/',
    desc: 'Generate secure, customizable, and cryptographically strong random passwords.',
    seoTitle: 'Secure Password Generator — Strong Random Passwords | ToolGenic',
    seoDesc: 'Create highly secure, custom passwords using cryptographically strong random number algorithms. Toggle letters, numbers, symbols, and length parameters.',
    iconName: 'Lock',
    features: [
      'Secure client-side random number entropy generation',
      'Configurable length scale from 8 to 128 characters',
      'Toggle uppercase, lowercase, digits, and special symbols',
      'Avoid similar characters option (e.g. O and 0, l and 1)'
    ],
    steps: [
      'Adjust length slider based on your security policies.',
      'Toggle desired options (numbers, special symbols, etc.).',
      'Activate "Exclude Similar" or "Pronounceable" options if needed.',
      'Watch the security meter update live.',
      'Click "Copy Password" or click "Re-generate" to cycle options.'
    ],
    benefits: [
      'Ensure zero repeating patterns across database and email credentials.',
      'Shield personal and financial accounts with high-entropy keys.',
      '100% offline generation prevents credential leaks or logs.'
    ],
    faq: [
      { q: 'How does the randomness work?', a: 'It leverages the Web Crypto API, creating cryptographically secure pseudo-random values.' },
      { q: 'Are generated passwords saved on your server?', a: 'No, passwords exist only inside your immediate browser session memory and are instantly cleared upon navigation.' }
    ],
    formats: ['Plaintext']
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'converters',
    path: '/converters/unit-converter/',
    desc: 'Convert length, weight, and temperatures with fluid real-time fields.',
    seoTitle: 'Smart Unit Converter Online — Speed, Mass, Temp | ToolGenic',
    seoDesc: 'Convert metric and imperial units across multiple categories including length, mass, volume, temperature, and speeds in real-time.',
    iconName: 'Calculator',
    features: [
      'Real-time conversions across all category parameters',
      'Supports Metric and Imperial standard scales',
      'Precise decimal adjustment and formatting option',
      'Responsive design is perfect for quick mobile unit matching'
    ],
    steps: [
      'Choose your category (Length, Weight, Temp, Area, Volume).',
      'Input the value in any unit field.',
      'Watch every secondary field compute and update instantly.',
      'Click to copy values or adjust calculation accuracy.'
    ],
    benefits: [
      'Fast matching for scientific, cooking, or international conversion requirements.',
      'Extremely clean layout avoids search-engine spam and popups.',
      'Works offline with zero web latency.'
    ],
    faq: [
      { q: 'Does this converter support fractional calculations?', a: 'It calculates up to 10 decimal digits for extreme precision.' },
      { q: 'Are all conversions standardized?', a: 'Yes, conversions match official international conversion constants.' }
    ],
    formats: ['Numeric']
  },
  {
    id: 'base64-codec',
    name: 'Base64 Encoder / Decoder',
    category: 'developer-tools',
    path: '/developer-tools/base64-encoder/',
    desc: 'Encode strings to Base64 or decode them back quickly and securely.',
    seoTitle: 'Base64 Encoder / Decoder Online — Free Transport Coding | ToolGenic',
    seoDesc: 'Encode UTF-8 plaintext strings to binary-safe transport base64 structures or decode them back cleanly inside your secure browser session.',
    iconName: 'RefreshCw',
    features: [
      'Encode raw lines or decode strings instantly',
      'Handles multi-line outputs cleanly',
      'Offline-secure UTF-8 compliant binary logic'
    ],
    steps: [
      'Input your plaintext or base64 lines.',
      'Select Encode or Decode mode.',
      'Review decoded outcomes computed in real-time.',
      'Click copy to clipboard.'
    ],
    benefits: [
      'Fast conversions for payload formatting.',
      'Zero latency client processing.'
    ],
    faq: [
      { q: 'Are my keys kept private?', a: 'Yes. ToolGenic processes text locally inside window memory.' }
    ],
    formats: ['ASCII', 'Plaintext']
  },
  {
    id: 'url-codec',
    name: 'URL Encoder / Decoder',
    category: 'developer-tools',
    path: '/developer-tools/url-encoder/',
    desc: 'Safely encode special characters for URI parameters or decode queries.',
    seoTitle: 'URL Encoder & Decoder Online — Format URI Params | ToolGenic',
    seoDesc: 'Safely convert special ASCII parameters into percent-encoded standard structures or parse query parameters instantly in your browser.',
    iconName: 'Sliders',
    features: [
      'Instant string mapping',
      'Robust error handling for corrupt encodings',
      'Full query string validation support'
    ],
    steps: [
      'Paste your URL parameters into the inputs.',
      'Click encode or decode.',
      'The clean formatting computes immediately.'
    ],
    benefits: [
      'Ensure standard-compliant paths and query strings.',
      '100% secure client-side computations.'
    ],
    faq: [
      { q: 'Does this handle standard query values?', a: 'Yes, it uses RFC 3986 URI standard protocols.' }
    ],
    formats: ['URI Parameter']
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    category: 'developer-tools',
    path: '/developer-tools/hash-generator/',
    desc: 'Generate SHA-1, SHA-256, and SHA-512 cryptographic checksums instantly.',
    seoTitle: 'Online Hash Generator — Secure Cryptographic Checksums | ToolGenic',
    seoDesc: 'Generate secure, standard SHA-1, SHA-256, and SHA-512 hashes from input strings natively using Web Crypto API.',
    iconName: 'FileCode',
    features: [
      'Calculates SHA-1, SHA-256, and SHA-512 checksums simultaneously',
      'Powered by browser Web Crypto API',
      'One-click copies for all generated hashes'
    ],
    steps: [
      'Paste or type your input string.',
      'Hashing calculations run automatically.',
      'Copy the required hash checksum.'
    ],
    benefits: [
      'Verify code files or integrity of data packets.',
      'Highest offline secure cryptography.'
    ],
    faq: [
      { q: 'Can this hash files?', a: 'It hashes any plaintext strings immediately inside browser memory.' }
    ],
    formats: ['Hash Sum']
  },
  {
    id: 'jwt-debugger',
    name: 'JWT Debugger',
    category: 'developer-tools',
    path: '/developer-tools/jwt-debugger/',
    desc: 'Decode and inspect JSON Web Tokens locally without transmitting data.',
    seoTitle: 'JWT Debugger Online — Decode JSON Web Tokens | ToolGenic',
    seoDesc: 'Inspect and debug JSON Web Tokens (JWT) locally. Parse header attributes, payload claims, and check expiry timestamps instantly.',
    iconName: 'Layers',
    features: [
      'Visual breakdown of base64url encoded token streams',
      'Syntax highlights for Header and Payload schemas',
      'Extract expiry dates and subject claims instantly'
    ],
    steps: [
      'Paste your encoded JWT string.',
      'The decoder reads the components split by dots.',
      'Inspect claims and header metadata.'
    ],
    benefits: [
      'Debug authentication tokens easily.',
      '100% private — tokens are never sent over the web.'
    ],
    faq: [
      { q: 'Do you verify signatures?', a: 'ToolGenic decodes JWT structures locally to help you inspect payloads.' }
    ],
    formats: ['JWT Token']
  },
  {
    id: 'word-counter',
    name: 'Word Counter & Scratchpad',
    category: 'developer-tools',
    path: '/developer-tools/word-counter/',
    desc: 'Analyze word count, sentences, reading speed, and convert text casing.',
    seoTitle: 'Online Word Counter — Free Scratchpad Analyzer | ToolGenic',
    seoDesc: 'Calculate total letters, spaces, sentences, reading times, and convert letters to UPPERCASE, lowercase, or Title Case dynamically.',
    iconName: 'FileText',
    features: [
      'Real-time counters for words, characters, sentences, and paragraphs',
      'Estimated reading duration metric',
      'One-click styling toggles (UPPER, lower, Title Case, Trim)'
    ],
    steps: [
      'Type or paste text content.',
      'All indicators compute instantly.',
      'Toggle case conversions or copy text.'
    ],
    benefits: [
      'Compose blog drafts or social posts within exact character bounds.',
      'Format raw texts with zero lag.'
    ],
    faq: [
      { q: 'Are my written notes stored?', a: 'Notes exist only inside your local memory and are never saved on any database servers.' }
    ],
    formats: ['Plaintext']
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/compress-pdf/',
    desc: 'Compress and reduce the file size of PDF documents while preserving text, formatting, and vector paths.',
    seoTitle: 'Free Online PDF Compressor — Reduce PDF File Size | ToolGenic',
    seoDesc: 'Compress PDF files natively in your browser. Choose extreme, recommended, or high-quality presets to optimize layouts, shrink vectors, and protect your data.',
    iconName: 'FileText',
    features: [
      'Multi-level preset compression modes (Extreme, Recommended, High Quality)',
      'Batch optimize multiple PDF documents simultaneously',
      'Client-side execution secures document confidentiality'
    ],
    steps: [
      'Select or drag and drop your PDF documents.',
      'Select your preferred optimization compression preset.',
      'Click "Compress PDF" to optimize.',
      'Download your optimized lightweight PDF document.'
    ],
    benefits: [
      'Reduce file size to fit strict email or form attachments.',
      'Keep text structures, links, and forms entirely editable.'
    ],
    faq: [
      { q: 'Does PDF compression corrupt font pairings?', a: 'No, our compressor compresses structural charts and image assets while leaving fonts and texts untouched.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'pdf-tools',
    path: '/pdf-tools/pdf-to-word/',
    desc: 'Extract paragraphs and text layouts from PDF files to Word documents.',
    seoTitle: 'PDF to Word Converter Online — Free Convert PDF to Word | ToolGenic',
    seoDesc: 'Transform vector PDF documents into standard editable Microsoft Word (.docx) files natively in your browser.',
    iconName: 'FileText',
    features: [
      'High-fidelity text extraction layers',
      'Preserve multi-page structural layouts and alignments',
      'Offline-secure document rendering engines'
    ],
    steps: [
      'Upload your PDF documents.',
      'Click "Convert to Word" to run the translation layers.',
      'Download your compiled Microsoft Word document.'
    ],
    benefits: [
      'Easily edit contract drafts, resumes, or invoices.',
      'No data is transferred over the network.'
    ],
    faq: [
      { q: 'Can this convert scanned PDF images?', a: 'Yes, it processes text layout layers to extract readable text tables.' }
    ],
    formats: ['PDF', 'DOCX']
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/word-to-pdf/',
    desc: 'Convert standard Microsoft Word (.docx, .doc) files into clean, professional PDF documents.',
    seoTitle: 'Word to PDF Converter Online — Convert DOCX to PDF | ToolGenic',
    seoDesc: 'Convert DOC, DOCX, and text document structures into standard vector PDFs natively in your browser.',
    iconName: 'FileText',
    features: [
      'Perfect typeface scaling and layout conversion',
      'Batch convert multiple files with one click',
      'Secure sandbox processing prevents data leaks'
    ],
    steps: [
      'Upload your .doc or .docx Word files.',
      'Click "Convert to PDF" to rasterize layout elements.',
      'Download your compiled PDF.'
    ],
    benefits: [
      'Protect document layout and styles across all screens.',
      'Generate universally readable legal records.'
    ],
    faq: [
      { q: 'Will my doc formatting change?', a: 'No, our vector compiler preserves fonts, margins, and structures.' }
    ],
    formats: ['DOCX', 'DOC', 'PDF']
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    category: 'pdf-tools',
    path: '/pdf-tools/pdf-to-image/',
    desc: 'Extract separate pages of PDF documents into high-quality JPEG or PNG images.',
    seoTitle: 'PDF to Image Converter — Extract PDF Pages to JPG/PNG | ToolGenic',
    seoDesc: 'Extract individual pages or groups of sheets from vector PDF files into JPEG and transparent PNG images offline.',
    iconName: 'ImageIcon',
    features: [
      'Toggle export to high-fidelity JPEG or lossless transparent PNG format',
      'Specify exact resolution DPI (72, 150, 300) for sharp output',
      'Zip bundle downloads for quick multi-page extractions'
    ],
    steps: [
      'Upload your PDF document.',
      'Select output format and resolution preset.',
      'Click "Extract Pages" to render image frames.',
      'Download individual pages or the combined ZIP archive.'
    ],
    benefits: [
      'Convert document slides to presentation-friendly images.',
      'Create high-resolution infographics out of data briefs.'
    ],
    faq: [
      { q: 'Is there a limit on page counts?', a: 'No, our offline extractor can process any length of PDF pages.' }
    ],
    formats: ['PDF', 'JPG', 'PNG']
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/rotate-pdf/',
    desc: 'Rotate separate pages or the entire PDF document by 90, 180, or 270 degrees.',
    seoTitle: 'Rotate PDF Online — Rotate PDF Pages Free | ToolGenic',
    seoDesc: 'Rotate PDF documents sideways or upside down. Set custom degrees page by page, preview layout orientations, and download files natively.',
    iconName: 'RefreshCw',
    features: [
      'Rotate individual pages or the entire document in batch mode',
      'Supports clockwise and counterclockwise rotations (90°, 180°, 270°)',
      'Visual interactive page orientations preview grids'
    ],
    steps: [
      'Upload your PDF document.',
      'Click on page thumbnails to rotate them individually.',
      'Click "Save orientations" to lock your rotations.',
      'Download your new rotated PDF.'
    ],
    benefits: [
      'Fix scanned documents with incorrect orientations.',
      'Align landscape schematics and charts perfectly.'
    ],
    faq: [
      { q: 'Does rotating PDF degrade content quality?', a: 'No, our compiler updates structural metadata values without degrading images or text layers.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'mp3-converter',
    name: 'MP3 Converter',
    category: 'audio-tools',
    path: '/audio-tools/mp3-converter/',
    desc: 'Convert any audio formats to standard high-quality MP3, WAV, or AAC sweeps.',
    seoTitle: 'Online MP3 Converter — Free Audio Transcoder | ToolGenic',
    seoDesc: 'Convert audio files (WAV, AAC, M4A, OGG, FLAC) to standard MP3 formats. Adjust sample rates, select target bitrates, and save files natively.',
    iconName: 'Music',
    features: [
      'Transcode to MP3, WAV, or AAC instantly',
      'Select customized bitrates from 128kbps to 320kbps',
      'Adjust sample rates from 44.1kHz to 48kHz for high-fidelity outputs'
    ],
    steps: [
      'Upload your sound file.',
      'Select output format, bitrate, and sample frequency.',
      'Click "Convert Audio" to execute encoding sweeps.',
      'Download your newly transcoded audio file.'
    ],
    benefits: [
      'Make any audio tracks compatible with smartphones and speakers.',
      'Optimize sound files for light email sizes.'
    ],
    faq: [
      { q: 'Are lossless formats like FLAC supported?', a: 'Yes, our offline converter decodes FLAC and exports high-quality MP3 tracks.' }
    ],
    formats: ['WAV', 'MP3', 'AAC', 'M4A', 'FLAC', 'OGG']
  },
  {
    id: 'audio-compressor',
    name: 'Audio Compressor',
    category: 'audio-tools',
    path: '/audio-tools/audio-compressor/',
    desc: 'Compress and optimize audio file sizes by adjusting bitrates and frequencies.',
    seoTitle: 'Free Online Audio Compressor — Shrink Sound Files | ToolGenic',
    seoDesc: 'Compress MP3, WAV, FLAC, and M4A audio tracks natively in your browser. Choose custom bitrates and quality levels while protecting your privacy.',
    iconName: 'Sliders',
    features: [
      'Configurable quality compression presets (Standard, High, Ultra)',
      'Real-time estimated target file size updates',
      'Complete client-side waveform optimization'
    ],
    steps: [
      'Upload your audio file.',
      'Select your preferred compression preset.',
      'Click "Compress Audio" to compress.',
      'Download your lightweight sound track.'
    ],
    benefits: [
      'Saves local space and internet download bandwidth.',
      'Prepares voice memos and podcasts for immediate social sharing.'
    ],
    faq: [
      { q: 'Will compressing audio ruin the audio quality?', a: 'Our compression algorithms utilize advanced psychoacoustic modeling to preserve human speech and melodies.' }
    ],
    formats: ['MP3', 'WAV', 'M4A', 'AAC']
  },
  {
    id: 'audio-cutter',
    name: 'Audio Cutter & Ringtones',
    category: 'audio-tools',
    path: '/audio-tools/audio-cutter/',
    desc: 'Cut and trim audio segments to create custom ringtones, clips, or notifications.',
    seoTitle: 'Audio Cutter & Ringtone Maker Online — Trim Audio | ToolGenic',
    seoDesc: 'Cut audio files and make custom smartphone ringtones with visual timelines. Crop sound tracks, set fade effects, and export clips securely.',
    iconName: 'Music',
    features: [
      'Interactive visual waveform timeline with adjustable start and end bounds',
      'Configure precise fade-in and fade-out durations',
      'Live audio preview controls for selected segments'
    ],
    steps: [
      'Upload your music track or sound recording.',
      'Slide the start and end markers to frame your selection.',
      'Specify fade-in and fade-out durations.',
      'Click "Export Audio Cut" and download your custom ringtone.'
    ],
    benefits: [
      'Easily extract favorite song choruses to use as custom alarms.',
      'Remove blank noises or long silences from voice memos.'
    ],
    faq: [
      { q: 'What formats can this trim?', a: 'It supports trimming MP3, WAV, AAC, M4A, and FLAC files natively.' }
    ],
    formats: ['MP3', 'WAV', 'AAC', 'FLAC']
  },
  {
    id: 'merge-audio',
    name: 'Merge Audio',
    category: 'audio-tools',
    path: '/audio-tools/merge-audio/',
    desc: 'Combine and stitch multiple audio tracks into a single seamless sound compilation.',
    seoTitle: 'Merge Audio Tracks Online — Free Audio Joiner | ToolGenic',
    seoDesc: 'Stitch and merge multiple audio files into a single master track. Arrange files vertically, configure crossfade overlaps, and compile formats securely.',
    iconName: 'Music',
    features: [
      'Stitch multiple files into a single audio track',
      'Easily rearrange sequence orders with responsive controls',
      'Configure crossfade sweeps to ensure seamless transitions'
    ],
    steps: [
      'Upload multiple audio files.',
      'Rearrange their sequence order using the arranger controls.',
      'Configure your preferred crossfade sweep overlapping duration.',
      'Click "Merge Selected Tracks" to compile.'
    ],
    benefits: [
      'Merge podcast segments, intros, and voice recordings.',
      'Combine musical suites and mixtape loops securely.'
    ],
    faq: [
      { q: 'Can I combine tracks of different formats?', a: 'Yes, our cross-codec transcoder allows stitching MP3 and WAV files together.' }
    ],
    formats: ['MP3', 'WAV', 'AAC', 'FLAC']
  },
  {
    id: 'voice-recorder',
    name: 'Voice Recorder',
    category: 'audio-tools',
    path: '/audio-tools/voice-recorder/',
    desc: 'Record audio directly from your microphone with echo cancellation and noise suppression.',
    seoTitle: 'Online Voice Recorder — Free Microphone Capture | ToolGenic',
    seoDesc: 'Capture voice recordings, podcasts, and notes from your browser. Includes echo cancellation, noise suppression, and instant downloads.',
    iconName: 'Mic',
    features: [
      'Real-time microphone capture utilizing browser MediaRecorder standard APIs',
      'Built-in customizable echo cancellation and room hum filters',
      'Export recordings instantly as WAV or MP3 files'
    ],
    steps: [
      'Configure your noise suppression and output format settings.',
      'Click "Start Voice Recording" to activate your microphone.',
      'Click pause or stop once you have finished capturing audio.',
      'Download your high-fidelity voice recording.'
    ],
    benefits: [
      'Record memos, reminders, meetings, or essays instantly.',
      'Zero download or software install requirements.'
    ],
    faq: [
      { q: 'Are my audio recordings saved to servers?', a: 'No, all microphone streams are processed inside active browser memory and are never sent to external servers.' }
    ],
    formats: ['WAV', 'MP3']
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    category: 'converters',
    path: '/converters/jpg-to-png/',
    desc: 'Convert lossy JPG/JPEG photographs into high-quality lossless PNG images.',
    seoTitle: 'JPG to PNG Converter Online — Free Lossless Convert | ToolGenic',
    seoDesc: 'Convert JPG images to PNG format offline in your browser. Reconstruct pixel color maps and export high-fidelity lossless graphics.',
    iconName: 'ImageIcon',
    features: [
      'Lossless pixel transcoding',
      'Batch process multiple photos in one click',
      'Instant downloads with full privacy protection'
    ],
    steps: [
      'Select or drag and drop your JPG images.',
      'Click "Convert JPGs to PNG" to transcode.',
      'Download individual PNG files or all at once.'
    ],
    benefits: [
      'Convert photographs to formats that support pixel-perfect transparency.',
      'Avoid generation quality loss during design edits.'
    ],
    faq: [
      { q: 'Does this converter compress images?', a: 'No, it maps JPG source structures to clean lossless PNG pixel streams without resizing.' }
    ],
    formats: ['JPG', 'JPEG', 'PNG']
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    category: 'converters',
    path: '/converters/png-to-jpg/',
    desc: 'Convert transparent PNG files into highly optimized, lightweight JPG images.',
    seoTitle: 'PNG to JPG Converter Online — Transcode PNG to JPG | ToolGenic',
    seoDesc: 'Convert PNG images to JPG format. Choose solid white, black, or custom background colors and adjust compression quality offline.',
    iconName: 'ImageIcon',
    features: [
      'Adjustable JPEG compression quality preset slider',
      'Set custom transparency fallback colors (White, Black, Custom)',
      'Interactive batch transcoding pipeline'
    ],
    steps: [
      'Upload your PNG images.',
      'Choose transparency fallback background color and quality.',
      'Click "Convert PNGs to JPG" to flatten and compress.',
      'Download your compiled JPG files.'
    ],
    benefits: [
      'Significantly reduce image file sizes for web pages.',
      'Add custom solid background colors to transparent logos.'
    ],
    faq: [
      { q: 'Why does my transparent PNG have a background?', a: 'Because JPG format does not support transparency. We let you configure custom fallback colors to ensure your image looks perfect.' }
    ],
    formats: ['PNG', 'JPG', 'JPEG']
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    category: 'converters',
    path: '/converters/currency-converter/',
    desc: 'Calculate global currency values in real-time with historical trend tracking.',
    seoTitle: 'Real-Time Currency Converter — Free Exchange Rates | ToolGenic',
    seoDesc: 'Convert 170+ global currencies in real-time. Swap currencies instantly, view popular pair trends, and see historical rate fluctuations.',
    iconName: 'RefreshCw',
    features: [
      'Simulated real-time exchange rates across 170+ fiat currencies',
      'Visual historical rate fluctuation line chart (7-day trend analysis)',
      'One-click result copying'
    ],
    steps: [
      'Enter the target monetary amount.',
      'Select your starting currency and desired ending currency.',
      'Observe conversions and the past 7-day rate trend.',
      'Copy the calculated result.'
    ],
    benefits: [
      'Compare vacation spending power instantly.',
      'Track exchange rate movements before executing wire transfers.'
    ],
    faq: [
      { q: 'How often are exchange rates updated?', a: 'Simulated exchange rates track standard market pricing structures in real-time.' }
    ],
    formats: ['Currency Value']
  },
  {
    id: 'pdf-to-word-converter',
    name: 'PDF to Word Converter',
    category: 'converters',
    path: '/converters/pdf-to-word-converter/',
    desc: 'Convert PDF files to editable Word documents with structural alignment.',
    seoTitle: 'Online PDF to Word Converter — Convert PDFs to DOCX | ToolGenic',
    seoDesc: 'Convert PDF documents into editable Microsoft Word (.docx) files offline. Preserve fonts, text, and grids securely.',
    iconName: 'FileText',
    features: [
      'Converts paragraphs, fonts, and borders accurately',
      'Batch processing for all files in queue',
      'Extract data tables into editable Word elements'
    ],
    steps: [
      'Select your PDF document files.',
      'Click "Convert to Word Document" to analyze.',
      'Download your formatted DOCX file.'
    ],
    benefits: [
      'Perfect for resumes, contracts, and business spreadsheets.',
      'Processes files locally inside your web browser.'
    ],
    faq: [
      { q: 'Is my document private?', a: 'Yes, all extraction and formatting tasks occur offline in your browser cache memory.' }
    ],
    formats: ['PDF', 'DOCX']
  },
  {
    id: 'word-to-pdf-converter',
    name: 'Word to PDF Converter',
    category: 'converters',
    path: '/converters/word-to-pdf-converter/',
    desc: 'Convert Word documents (.doc, .docx) to universally lockable vector PDF files.',
    seoTitle: 'Online Word to PDF Converter — Free DOCX to PDF | ToolGenic',
    seoDesc: 'Compile DOC, DOCX, and formatted drafts into universally lockable vector PDFs natively in your browser.',
    iconName: 'FileText',
    features: [
      'Perfect typesetting preservation across devices',
      'Secure sandbox processing prevents data exposure',
      'Fast, lightweight multi-document compilations'
    ],
    steps: [
      'Select your Word document files.',
      'Click "Convert to PDF Document" to execute.',
      'Download your newly compiled PDF files.'
    ],
    benefits: [
      'Keep files safe from tampering and unexpected layout shifts.',
      'Submit academic reports and resumes in standardized formats.'
    ],
    faq: [
      { q: 'Do I need Microsoft Word installed?', a: 'No, our standalone vector compiler processes DOC/DOCX files natively in your browser.' }
    ],
    formats: ['DOCX', 'DOC', 'PDF']
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG',
    category: 'converters',
    path: '/converters/webp-to-jpg/',
    desc: 'Convert next-gen WebP images into universally compatible and highly optimized JPG format.',
    seoTitle: 'Free WebP to JPG Converter Online — Offline Batch Convert | ToolGenic',
    seoDesc: 'Convert next-gen WebP images to universally supported JPG format in bulk. Process fully offline inside your browser. Adjust image quality, preserve original resolutions, and download ZIP archives.',
    iconName: 'ImageIcon',
    features: [
      '100% Secure offline browser-based conversion — files never touch any servers',
      'Batch conversion processing for multiple WebP images simultaneously',
      'Configurable output quality slider to control file size and compression',
      'Preserves original horizontal and vertical resolutions 100%',
      'Interactive side-by-side before/after comparison split slider',
      'Download converted files individually or compiled as a single ZIP archive'
    ],
    steps: [
      'Upload or drag and drop your WebP images into the converter area.',
      'Configure your preferred output JPEG quality level using the slider.',
      'Review converted images in the queue with live file size statistics.',
      'Use the interactive split comparison slider to inspect visual quality.',
      'Click to download JPGs individually or bundle them as a ZIP file.'
    ],
    benefits: [
      'Ensures next-gen WebP assets open perfectly on legacy platforms, editors, and operating systems.',
      'Safeguards your absolute privacy by converting images locally on your own computer.',
      'Optimizes and speeds up workflows with rapid multi-file batch downloading.'
    ],
    faq: [
      { q: 'Is my data private during WebP to JPG conversion?', a: 'Yes. All image decoding and transcoding calculations happen entirely within your local browser memory. No files are ever sent to any servers.' },
      { q: 'How does the Before/After comparison split preview work?', a: 'Once an image is converted, hovering or sliding across the preview displays the original WebP next to the newly compiled JPG to verify pixel fidelity.' },
      { q: 'Can I batch-upload hundreds of WebP images?', a: 'Absolutely! Our browser engine processes files in parallel and lets you download all outputs in a single consolidated ZIP archive.' }
    ],
    formats: ['WEBP', 'JPG', 'JPEG']
  },
  {
    id: 'jpg-to-webp',
    name: 'JPG to WebP',
    category: 'converters',
    path: '/converters/jpg-to-webp/',
    desc: 'Convert standard JPG, JPEG, and PNG images into highly compressed next-gen WebP format.',
    seoTitle: 'Free JPG to WebP Converter Online — Optimize & Shrink Images | ToolGenic',
    seoDesc: 'Convert JPG, JPEG, and PNG images to WebP format. Supports lossless and lossy compression sliders, interactive split compares, and offline batch ZIP downloads.',
    iconName: 'ImageIcon',
    features: [
      'Advanced client-side next-gen WebP compression encoding',
      'Supports lossy mode with compression slider and lossless mode toggle',
      'Batch process multiple files in parallel browser worker threads',
      'Interactive sliding split comparisons show raw quality side-by-side',
      'Processes fully in-browser to secure your personal photos and data'
    ],
    steps: [
      'Select or drag JPG/JPEG/PNG photos into the upload box.',
      'Choose between lossless encoding or adjust the quality compression slider.',
      'Click "Convert JPGs to WebP" to execute local processing.',
      'Slide the interactive comparison bar to inspect visual compression differences.',
      'Download individual WebP files or click "Download ZIP" for all.'
    ],
    benefits: [
      'Accelerates website load speeds by reducing image file sizes up to 80%.',
      'Maintains pristine image quality while reclaiming extensive storage space.',
      'Guarantees data confidentiality as files never traverse external networks.'
    ],
    faq: [
      { q: 'What is the advantage of converting JPG to WebP?', a: 'WebP provides superior lossless and lossy compression for images on the web, yielding files that are typically 25% to 35% smaller than JPGs at identical visual quality.' },
      { q: 'What is the difference between Lossless and Lossy WebP?', a: 'Lossless WebP preserves every single pixel identically with zero quality loss (best for graphics/PNGs). Lossy mode discards minor visual noise to achieve highly optimized file sizes.' }
    ],
    formats: ['JPG', 'JPEG', 'PNG', 'WEBP']
  },
  {
    id: 'webp-to-png',
    name: 'WebP to PNG',
    category: 'converters',
    path: '/converters/webp-to-png/',
    desc: 'Convert WebP images into high-quality lossless PNG format while preserving transparency.',
    seoTitle: 'Free WebP to PNG Converter Online — Preserve Transparency | ToolGenic',
    seoDesc: 'Convert WebP images to lossless PNG format in your browser. Fully preserve transparent backgrounds, maintain high resolution, and batch-transcode images securely.',
    iconName: 'ImageIcon',
    features: [
      'Lossless transcode maps next-gen WebP to standardized PNG pixel grids',
      'Full preservation of transparent backgrounds (alpha-channel transparency)',
      'Preserves original horizontal and vertical resolutions 100%',
      'Batch process multiple files simultaneously in your browser sandbox',
      'Private, local browser processing with no external server uploads'
    ],
    steps: [
      'Upload or drag and drop your WebP files into the workstation queue.',
      'Toggle the transparency preservation settings as desired.',
      'Click "Convert WebPs to PNG" to process images locally.',
      'Inspect original and converted results side-by-side in the list view.',
      'Download your PNG images individually or package them as a ZIP.'
    ],
    benefits: [
      'Restores files to formats that support editing in standard design systems.',
      'Maintains crystal-clear alpha-transparency on logos, icons, and vector outputs.',
      'Processes files securely on your own device with zero internet latency.'
    ],
    faq: [
      { q: 'How does WebP to PNG handle transparent backgrounds?', a: 'By default, the converter extracts the WebP alpha channel and maps it directly onto the PNG format, preserving transparency perfectly.' },
      { q: 'Does this converter reduce image quality?', a: 'No. Since PNG is a lossless format, the pixels are rendered with absolute fidelity, maintaining original image crispness.' }
    ],
    formats: ['WEBP', 'PNG']
  },
  {
    id: 'png-to-webp',
    name: 'PNG to WebP',
    category: 'converters',
    path: '/converters/png-to-webp/',
    desc: 'Convert transparent PNG images to highly compressed next-gen WebP format.',
    seoTitle: 'Free PNG to WebP Converter Online — Secure Lossless Compress | ToolGenic',
    seoDesc: 'Convert PNG images to highly compressed WebP format in bulk. Fully preserve background transparency, toggle lossless modes, and preview file sizes offline.',
    iconName: 'ImageIcon',
    features: [
      'Preserve PNG transparency and alpha channels perfectly in WebP',
      'Interactive lossless toggle for pixel-perfect compression matching',
      'Adjustable compression level quality slider for lossy optimizations',
      'Parallel batch rendering processes hundreds of files in seconds',
      'Real-time before/after file size compression statistics'
    ],
    steps: [
      'Upload or drag PNG images into the converter box.',
      'Select "Lossless" mode or adjust the Quality compression slider.',
      'Click "Convert PNGs to WebP" to trigger local encoding matrices.',
      'Inspect file size statistics and compression ratios in real-time.',
      'Save outputs individually or bundle into a single zipped archive.'
    ],
    benefits: [
      'Saves extensive cloud hosting bandwidth by shrinking transparent graphics up to 70%.',
      'Retains absolute transparency and sharp details required for banners and web overlays.',
      'Complete local safety as all processes execute inside browser sandbox memory.'
    ],
    faq: [
      { q: 'Will my transparent PNG remain transparent after WebP conversion?', a: 'Yes! WebP fully supports alpha-channel transparency, so your icons and overlays will retain their transparent areas perfectly.' },
      { q: 'Is lossless WebP conversion truly lossless?', a: 'Yes. In lossless mode, the image pixels are mathematically identical to the original PNG but are stored in a highly optimized structure.' }
    ],
    formats: ['PNG', 'WEBP']
  },
  {
    id: 'svg-to-png',
    name: 'SVG to PNG',
    category: 'converters',
    path: '/converters/svg-to-png/',
    desc: 'Convert SVG vector graphics into high-resolution transparent PNG images.',
    seoTitle: 'Free SVG to PNG Converter Online — High-Res Transparent Export | ToolGenic',
    seoDesc: 'Convert SVG vector files to transparent PNG images. Customize pixel widths, heights, select output DPI values (up to 300 DPI), and export high-resolution assets.',
    iconName: 'RefreshCw',
    features: [
      'Convert scalable vector graphics (SVG) into rasterized PNG pixels',
      'Customize output dimensions (Width and Height) with aspect ratio locking',
      'DPI Selection (72, 96, 150, 300 DPI) for ultra-sharp high-resolution exports',
      'Toggle transparent backgrounds or select custom solid background colors',
      '100% secure client-side rendering protects proprietary logos and assets'
    ],
    steps: [
      'Select or drag your SVG file into the workspace.',
      'Input customized width and height, or keep original dimensions.',
      'Select your target output resolution (72, 96, 150, or 300 DPI).',
      'Toggle transparent backgrounds or pick a custom hex color.',
      'Click "Convert SVG to PNG" and download your crisp high-res image.'
    ],
    benefits: [
      'Enables printing and sharing scalable SVG artwork in highly compatible PNG formats.',
      'Allows creating crisp high-density assets for retina and 4K displays.',
      'Keeps vector blueprints entirely private — processing runs locally.'
    ],
    faq: [
      { q: 'How does DPI selection affect the PNG output?', a: 'Standard SVGs render at 96 DPI. Selecting 300 DPI scales the output width and height proportionally to generate a crisp high-resolution PNG perfect for print.' },
      { q: 'Can I export SVGs with transparent backgrounds?', a: 'Yes! PNG fully supports transparency, so the background remains transparent by default unless you uncheck it and pick a custom color.' }
    ],
    formats: ['SVG', 'PNG']
  },
  {
    id: 'svg-to-jpg',
    name: 'SVG to JPG',
    category: 'converters',
    path: '/converters/svg-to-jpg/',
    desc: 'Convert SVG vector files into highly compatible and lightweight JPG images.',
    seoTitle: 'Free SVG to JPG Converter Online — High Resolution Export | ToolGenic',
    seoDesc: 'Convert SVG vector graphics to JPG format offline. Set custom pixel sizes, choose output DPI levels, pick background fallback colors, and configure quality.',
    iconName: 'RefreshCw',
    features: [
      'Convert scalable vector graphics (SVG) into lightweight JPG images',
      'Specify custom pixel dimensions with aspect ratio locking capabilities',
      'Set high-resolution DPI levels (72, 96, 150, 300 DPI) for sharp outputs',
      'Choose customized background fallback colors (defaults to white)',
      'Adjust JPG compression quality to balance file size and visual details'
    ],
    steps: [
      'Upload your SVG vector graphic.',
      'Adjust the target width and height inputs as required.',
      'Choose your resolution DPI scaling multiplier and JPG compression quality.',
      'Select a background color (since JPG format does not support transparency).',
      'Click "Convert SVG to JPG" and download your formatted file.'
    ],
    benefits: [
      'Converts infinite-scalable artwork into lightweight files suitable for emails and websites.',
      'Fine-tune outputs with exact quality and resolution controls.',
      'Processes proprietary files locally on your own machine for high privacy.'
    ],
    faq: [
      { q: 'Why does SVG to JPG require a background color?', a: 'Since JPEG does not support transparency, transparent areas of the SVG must be filled. You can configure any background color of your choice (defaults to white).' },
      { q: 'Will the JPG become blurry when scaled?', a: 'By rendering the vector SVG at higher DPI settings (e.g., 300 DPI), the browser generates an extremely high-resolution JPG that remains highly detailed.' }
    ],
    formats: ['SVG', 'JPG', 'JPEG']
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/unlock-pdf/',
    desc: 'Remove passwords, restrictions, and general permission blocks from PDF files instantly.',
    seoTitle: 'Free Online PDF Unlocker — Remove PDF Password & Restrictions | ToolGenic',
    seoDesc: 'Instantly unlock password-protected PDF files online. Remove editing, printing, and copying constraints natively in your browser with zero data leakage.',
    iconName: 'Lock',
    features: [
      'Natively decrypt standard PDF permission restrictions in milliseconds',
      'Support for both owner and open decryption passwords',
      'Batch unlock multiple encrypted PDF files simultaneously',
      '100% private sandbox client processing — passwords never leave your system'
    ],
    steps: [
      'Select or drag and drop your password-protected PDF files.',
      'Enter the decryption password for each locked document.',
      'Click "Decrypt" for single files or "Unlock Checked PDFs" for batch queue.',
      'Download your unlocked, editable, and printable PDF documents.'
    ],
    benefits: [
      'Easily edit or print scanned receipts, statements, and reports with lock-outs.',
      'Save time with batch decryption capabilities.',
      'No files are ever uploaded or transmitted across external networks.'
    ],
    faq: [
      { q: 'Is it safe to type my sensitive PDF password on this site?', a: 'Yes. ToolGenic runs entirely inside your browser cache. All cryptographic verification and permission removals occur offline, keeping your credentials fully secure.' },
      { q: 'Can this tool decrypt any locked PDF without the password?', a: 'To bypass permission blocks (printing/copying restrictions), the tool decodes structures automatically. For strong file open-passwords, you must provide the password to initiate decryption.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/protect-pdf/',
    desc: 'Secure PDF files with strong AES encryption passwords and restrict copy/edit permissions.',
    seoTitle: 'Secure PDF Protector — Encrypt PDF Files with Password | ToolGenic',
    seoDesc: 'Encrypt your PDF documents with military-grade 128-bit or 256-bit AES encryption. Block unauthorized copying, printing, and modification natively.',
    iconName: 'Lock',
    features: [
      'Apply standard military-grade AES-128 or AES-256 bit file encryption',
      'Block unauthorized high-resolution printing options',
      'Enforce restrictions against text and graphic copying/extraction',
      'Block third-party modification, form filling, and structural editing'
    ],
    steps: [
      'Upload the PDF files you want to secure.',
      'Enter and confirm your chosen document encryption password.',
      'Toggle desired permission restrictions (block printing, editing, or copying).',
      'Choose between AES-256 (Strongest) and AES-128 (Faster) algorithm presets.',
      'Click "Encrypt & Protect" and download your newly secured files.'
    ],
    benefits: [
      'Protect intellectual property and proprietary trade templates from leakage.',
      'Ensure secure distribution of legal agreements, resumes, and financials.',
      'Guaranteed client-side offline execution secures private details.'
    ],
    faq: [
      { q: 'What is the difference between AES-128 and AES-256 encryption?', a: 'AES-256 represents the industry gold-standard used by governments and financial institutions, offering the highest cryptographic barrier against brute-force attacks.' },
      { q: 'Will readers need special software to open my protected PDF?', a: 'No, any standard web browser or default PDF viewer (Acrobat, macOS Preview, Chrome) will prompt them for the password automatically.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'pdf-tools',
    path: '/pdf-tools/delete-pdf-pages/',
    desc: 'Remove unnecessary pages and slides from PDF files visually.',
    seoTitle: 'Free PDF Page Remover — Delete PDF Pages Online | ToolGenic',
    seoDesc: 'Select and discard unnecessary page frames from your PDF documents. Enjoy visual thumbnail grids, dynamic undo actions, and fast compile speeds.',
    iconName: 'Trash2',
    features: [
      'Generates beautiful interactive thumbnail previews of all document pages',
      'Click-to-select page nodes for bulk removal in one sweep',
      'Stateful multi-step "Undo" queue lets you restore discarded slides instantly',
      'Local rendering maintains original text alignment and layout'
    ],
    steps: [
      'Select or drag and drop your PDF document into the workstation.',
      'Browse through the rendered page thumbnails.',
      'Click to highlight and select the pages you want to delete.',
      'Click the "Delete Selected" button to discard them.',
      'Click "Apply Changes & Compile PDF" to render, then download the lightweight output.'
    ],
    benefits: [
      'Quickly strip empty pages, duplicates, or covers from large manuals.',
      'Reduce file size significantly by removing graphic-heavy page sections.',
      'Completely offline execution secures proprietary documents.'
    ],
    faq: [
      { q: 'Will deleting pages damage hyperlinks or texts on the remaining pages?', a: 'No, our layout engine retains structural vector paths, bookmarks, and font mappings cleanly for all surviving pages.' },
      { q: 'Can I undo a page removal after compiling?', a: 'Before you reset or leave the workstation, our state tracking allows multi-step Undo. Once compiled and downloaded, the original PDF on your device remains unaffected.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    category: 'pdf-tools',
    path: '/pdf-tools/extract-pdf-pages/',
    desc: 'Extract specific pages or page ranges from PDF files into a new document.',
    seoTitle: 'Online PDF Extractor — Extract Specific PDF Pages Free | ToolGenic',
    seoDesc: 'Extract individual pages or groups of slides from PDF files. Input page ranges like "1-3, 5" or click visual thumbnails to build a new document.',
    iconName: 'FileText',
    features: [
      'Dual-selection mode: click slide cards or type ranges (e.g. 1-3, 5)',
      'Responsive syncing: selecting thumbnails dynamically updates range inputs',
      'Compile all extracted components into a single standalone PDF',
      'Preserve hyperlinks, vectors, metadata, and font sets'
    ],
    steps: [
      'Upload your source PDF document.',
      'Enter page ranges manually (e.g., "1-4, 7") or click page thumbnails to select.',
      'Review your active selection queue.',
      'Click "Extract Selected Pages" to construct the sub-document.',
      'Download your compiled output file.'
    ],
    benefits: [
      'Isolate invoices, contract clauses, or chapters from multi-page sheets.',
      'Share only necessary content slides instead of entire databases or reports.',
      'Ultra-fast local script compiling ensures no server delays.'
    ],
    faq: [
      { q: 'Does extraction affect the original uploaded PDF?', a: 'No, the original PDF remains unchanged on your computer. The tool simply duplicates selected components inside browser memory to assemble a new file.' },
      { q: 'Is there a limit to how many pages I can extract?', a: 'No. Since processing happens entirely in your device\'s local memory, you can extract any volume of sheets smoothly.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    category: 'pdf-tools',
    path: '/pdf-tools/pdf-to-excel/',
    desc: 'Extract structured tables from PDF files into fully editable Microsoft Excel spreadsheets.',
    seoTitle: 'Free Online PDF to Excel Converter — Extract Tables to XLSX | ToolGenic',
    seoDesc: 'Convert PDF tables and matrices into editable Microsoft Excel (.xlsx) spreadsheets offline. Enjoy smart table boundary detection and OCR.',
    iconName: 'FileCode',
    features: [
      'Advanced client-side optical character recognition (OCR) solver',
      'Smart grid auto-mapping preserves row and column integrity',
      'Split PDF page slides into separate spreadsheet sheet tabs automatically',
      'Queue multiple PDF conversions simultaneously in batch mode'
    ],
    steps: [
      'Select and load your PDF document containing data grids.',
      'Toggle "OCR Engine" if scanning image-based or scanned PDFs.',
      'Choose to split pages into separate Excel sheet tabs or merge into one.',
      'Click "Convert to Excel" to parse cells.',
      'Download your compiled .xlsx spreadsheet file.'
    ],
    benefits: [
      'Save hours of manual data entry by exporting bank statements and ledgers.',
      'Retain table values, alignments, and decimals accurately.',
      'Maintain maximum privacy with offline-first data conversions.'
    ],
    faq: [
      { q: 'How does the converter identify tables in my PDF?', a: 'Our parsing script scans tabular cells, vertical divider lines, and blank columns to reconstruct a matching row-column matrix in Microsoft Excel.' },
      { q: 'Will the formulas be preserved?', a: 'PDFs only contain flattened text strings, so math formulas are compiled as static numeric values. Text alignments and grid lines remain editable.' }
    ],
    formats: ['PDF', 'XLSX']
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/excel-to-pdf/',
    desc: 'Convert XLS or XLSX spreadsheets to beautifully formatted print-ready PDF files.',
    seoTitle: 'Free Online Excel to PDF Converter — Convert XLSX to PDF | ToolGenic',
    seoDesc: 'Convert Microsoft Excel (.xls/.xlsx) spreadsheets to PDF. Customize page sizes, sheet orientations, margins, and fit-to-page scales instantly.',
    iconName: 'FileCode',
    features: [
      'Adjust layout dimensions (A4, Letter, Legal) and sheet margins',
      'Enforce orientation locks (Landscape/Portrait) for wider grids',
      'Fit-to-page scale automatically compresses columns into one page width',
      'Preserves original cells borders, formatting, fonts, and chart vectors'
    ],
    steps: [
      'Upload your Microsoft Excel workbook (.xls or .xlsx).',
      'Specify target Page Size, Margins, and Portrait/Landscape orientation.',
      'Check "Scale to Fit Page Width" to prevent broken tabular overflows.',
      'Click "Convert to PDF" to rasterize cells.',
      'Download your print-ready vector PDF document.'
    ],
    benefits: [
      'Ensure grid columns never overflow or get cropped on physical prints.',
      'Share secure, non-editable sheets and data ledgers with clients.',
      'Local formatting safeguards business metrics from external storage.'
    ],
    faq: [
      { q: 'How do I prevent my wide Excel tables from getting cut off on PDF?', a: 'We recommend choosing "Landscape" orientation and enabling the "Scale to Fit Page Width" option. This automatically rescales larger matrices proportionally.' },
      { q: 'Are multiple sheets supported?', a: 'Yes, our compiler processes all active sheets in the uploaded workbook sequentially.' }
    ],
    formats: ['XLSX', 'XLS', 'PDF']
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/ocr-pdf/',
    desc: 'Extract editable text from scanned PDF documents and image files.',
    seoTitle: 'Free Online PDF OCR — Scan PDF to Searchable Text | ToolGenic',
    seoDesc: 'Convert scanned PDF documents into editable texts and searchable PDFs. Highly accurate multilingual optical character recognition.',
    iconName: 'AlignLeft',
    features: [
      'Highly accurate multilingual OCR (English, Spanish, French, German, Chinese, Japanese)',
      'Generates searchable overlay text layer for standard PDF viewers',
      'Interactive text box allows on-the-fly editing and correction of outputs',
      'Export outputs in multiple formats: plain TXT, Word doc, or Searchable PDF'
    ],
    steps: [
      'Upload your scanned PDF document.',
      'Select the corresponding language of the text scanned.',
      'Toggle "Recompile Searchable PDF Layer" to keep the visual PDF with selectable texts.',
      'Click "Recognize & Extract Text" to run the character scans.',
      'Copy characters from the interactive editor or download formatted TXT/Word/PDF outputs.'
    ],
    benefits: [
      'Make printed contracts, photocopied agreements, and scanned receipts searchable.',
      'Extract long paragraphs and numerical statements in one sweep.',
      '100% secure client-side processing keeps confidential text elements private.'
    ],
    faq: [
      { q: 'How does searchable PDF work?', a: 'The OCR engine overlays invisible, selectable text characters directly on top of the corresponding pixels of the original scanned PDF image, allowing searches (Ctrl+F).' },
      { q: 'Does this tool support handwriting recognition?', a: 'Our engine is highly optimized for printed typefaces. Clean handprints may recognize, but stylized cursive scripts could produce exceptions.' }
    ],
    formats: ['PDF', 'TXT', 'DOCX']
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    category: 'pdf-tools',
    path: '/pdf-tools/organize-pdf/',
    desc: 'Reorder, rotate, delete, or duplicate pages in your PDF document visually.',
    seoTitle: 'Free PDF Organiser Online — Reorder & Move PDF Pages | ToolGenic',
    seoDesc: 'Rearrange and organize PDF files online. Drag and drop slides, rotate landscape layouts, duplicate nodes, and delete specific sheets visually.',
    iconName: 'Layers',
    features: [
      'Responsive card grids showing visual sheet indices',
      'Rotate single pages clockwise in 90-degree increments',
      'Click to instantly duplicate any page or slide node',
      'Specific relocation tool: specify moving index from source to target positions'
    ],
    steps: [
      'Upload your PDF document.',
      'Use position arrow controllers to slide page cards left and right.',
      'Use top relocation inputs to shift a specific page node to a targeted index.',
      'Click individual page controls to rotate 90°, duplicate, or delete slides.',
      'Click "Save & Compile" to bundle the new PDF sequence, and download.'
    ],
    benefits: [
      'Perfect for sorting scanned pages, invoices, and presentation slides.',
      'Align landscape and portrait pages correctly by rotating.',
      'Eliminate the need for costly offline PDF editing licenses.'
    ],
    faq: [
      { q: 'Will organizing pages reduce image resolutions or text formatting?', a: 'No, the compiler updates page order metadata trees and structural rotations without altering vector scales, fonts, or image DPIs.' },
      { q: 'Is there a limit on file size?', a: 'No, because compiling operations occur client-side, the file bounds are only limited by your device\'s system RAM.' }
    ],
    formats: ['PDF']
  },
  {
    id: 'heic-to-jpg',
    name: 'HEIC to JPG',
    category: 'image-tools',
    path: '/image-tools/heic-to-jpg/',
    desc: 'Convert Apple HEIC and HEIF photos to high-quality JPEG images instantly.',
    seoTitle: 'Free HEIC to JPG Converter Online — Apple HEIF to JPEG | ToolGenic',
    seoDesc: 'Convert Apple HEIC / HEIF image files to standard JPG format in bulk. Preserve original EXIF camera details, customize qualities, and batch download.',
    iconName: 'ImageIcon',
    features: [
      'Fast batch transcoder converts multiple HEIC pictures simultaneously',
      'Preserve original EXIF camera metadata, GPS tags, and capture dates',
      'Custom quality sliders optimize file size compression ratios',
      'Download converted photos individually or bundled inside ZIP files'
    ],
    steps: [
      'Select or drag-and-drop your .heic or .heif photos.',
      'Adjust the JPEG output quality slider.',
      'Toggle whether to preserve original EXIF camera metadata tags.',
      'Click "Convert to JPG" to run the transcoding process.',
      'Download your converted files individually or as a single ZIP archive.'
    ],
    benefits: [
      'Saves storage and ensures files are compatible on any non-Apple operating system.',
      '100% private execution — photo processing runs offline inside your browser memory.',
      'Free conversion with no limits on file sizes or upload quantities.'
    ],
    faq: [
      { q: 'Why do HEIC images need conversion?', a: 'Apple uses HEIC (High Efficiency Image Coding) to compress file sizes, but many websites, editors, and Windows/Android devices do not support it natively.' },
      { q: 'Is there a limit to how many files I can convert?', a: 'No. Since conversion occurs locally on your own computer, there are no batch limits or quotas.' }
    ],
    formats: ['HEIC', 'HEIF', 'JPG', 'JPEG']
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    category: 'image-tools',
    path: '/image-tools/crop-image/',
    desc: 'Crop, zoom, rotate, and scale pictures to exact dimensions and preset ratios.',
    seoTitle: 'Free Online Image Crop Tool — Aspect Ratio Presets | ToolGenic',
    seoDesc: 'Crop, zoom, rotate, and scale images to exact dimensions natively. Preset ratios for Square, Circle, Instagram, YouTube, Facebook, and LinkedIn.',
    iconName: 'Maximize2',
    features: [
      'Fully interactive draggable crop bounding area with grid lines',
      'Social media templates: Instagram Post/Story, YouTube, Facebook Cover, LinkedIn',
      'Circle crop mask handles avatars, logos, and rounded profile formats',
      'Zoom and rotation alignment sliders for precision orientation'
    ],
    steps: [
      'Upload the photo you would like to crop.',
      'Select an aspect ratio preset or adjust the crop box freely.',
      'Use the zoom and rotation sliders to center the perfect alignment.',
      'Click "Crop & Download Image" to export.',
      'Your cropped image will instantly download in PNG/JPG format.'
    ],
    benefits: [
      'Quickly prepare profile pictures, covers, banners, and thumbnails.',
      'Keep visual elements crisp with high-fidelity canvas cropping engines.',
      'Complete local safety — your private images are never sent to external servers.'
    ],
    faq: [
      { q: 'Does cropping reduce my image quality?', a: 'No. Our cropper uses HTML5 canvases to isolate pixel coordinate grids directly from your original resolution.' },
      { q: 'What aspect ratios are available?', a: 'Presets include Square (1:1), Circle, Instagram Post, Instagram Story, YouTube Thumbnail, Facebook Cover, and LinkedIn Banner.' }
    ],
    formats: ['PNG', 'JPG', 'JPEG', 'WEBP']
  },
  {
    id: 'jpg-to-png-img',
    name: 'JPG to PNG',
    category: 'image-tools',
    path: '/image-tools/jpg-to-png/',
    desc: 'Convert lossy JPG photographs into lossless professional PNG images.',
    seoTitle: 'Free JPG to PNG Converter Online — Preserve Quality | ToolGenic',
    seoDesc: 'Convert JPEG/JPG images to high-quality lossless PNG format online. Supports batch uploading, drag & drop, and local conversion.',
    iconName: 'ImageIcon',
    features: [
      'Reconstruct lossy JPG cosine blocks into lossless PNG scans',
      'Preserve exact horizontal and vertical resolutions 100%',
      'Batch drop zone handles multiple uploads simultaneously',
      'Bundled ZIP downloads and individual download controls'
    ],
    steps: [
      'Select or drag JPG files into the upload box.',
      'Queue up files and review sizes in the itemized list.',
      'Click "Convert JPGs to PNG" to transcode.',
      'Download individual PNG files or click "Download ZIP" for all.'
    ],
    benefits: [
      'Prepare JPEG captures for graphic design, overlays, and transparency edits.',
      'Avoid generation loss associated with editing and resaving JPG files.',
      'Completely secure — your photos remain local to your computer.'
    ],
    faq: [
      { q: 'Will converting a JPG to PNG make it transparent?', a: 'No. Because JPG files do not contain transparency layers, the converted PNG will still have its solid color backdrop, which you can then edit out.' },
      { q: 'Is my data private?', a: 'Yes, your images are transcoded entirely on your device and are never sent to our servers.' }
    ],
    formats: ['JPG', 'JPEG', 'PNG']
  },
  {
    id: 'png-to-jpg-img',
    name: 'PNG to JPG',
    category: 'image-tools',
    path: '/image-tools/png-to-jpg/',
    desc: 'Convert transparent PNG files into lightweight, flattened JPG images.',
    seoTitle: 'Free PNG to JPG Converter Online — Flat Backgrounds | ToolGenic',
    seoDesc: 'Convert transparent PNGs to flattened JPEG images in bulk. Customize background fallback colors, adjust quality scales, and compile ZIP files.',
    iconName: 'ImageIcon',
    features: [
      'Interactive background fallback color picker for transparency',
      'Adjustable JPEG compression quality slider (10% - 100%)',
      'Queue multiple high-res PNG file conversions simultaneously',
      'Download all converted files instantly in a zipped archive'
    ],
    steps: [
      'Select or drop your transparent PNG images into the drag box.',
      'Adjust the JPEG output quality slider.',
      'Select white, black, or input a custom background hex color for transparent zones.',
      'Click "Convert PNGs to JPG" to flatten and transcode.',
      'Save outputs individually or bundle into a single ZIP archive.'
    ],
    benefits: [
      'Dramatically reduces file sizes for faster web hosting and email attachments.',
      'Fills transparent regions with solid backgrounds of your choice.',
      'Runs fully client-side to ensure confidential graphics are never leaked.'
    ],
    faq: [
      { q: 'What happens to transparency when converting PNG to JPG?', a: 'Because JPEG formats do not support alpha channels, transparent pixels must be flattened. You can configure the fallback color to white, black, or any custom color.' },
      { q: 'Does converting PNG to JPG reduce file size?', a: 'Yes, because JPEG uses lossy compression, file sizes are often 50% to 90% smaller than the original lossless PNG.' }
    ],
    formats: ['PNG', 'JPG', 'JPEG']
  },
  {
    id: 'rotate-image',
    name: 'Rotate Image',
    category: 'image-tools',
    path: '/image-tools/rotate-image/',
    desc: 'Rotate images by specific angles, standard degree presets, or customized sweeps.',
    seoTitle: 'Free Online Image Rotator — Rotate Photos in Batch | ToolGenic',
    seoDesc: 'Rotate pictures in bulk online. Flip orientations 90°, 180°, 270° degrees, or select custom precision sweep coordinates completely offline.',
    iconName: 'RotateCw',
    features: [
      'Apply standardized degree sweeps: 90°, 180°, 270° degrees in bulk',
      'Precision custom angle slider adjusts exact clockwise alignments',
      'Flip single files clockwise/counterclockwise within the live queue',
      'Auto-expands output canvas dimensions to preserve corner pixels'
    ],
    steps: [
      'Upload the images you would like to rotate.',
      'Set a global degree preset or use the precision slider.',
      'Click the rotate arrows on individual cards for custom overrides.',
      'Click "Rotate Queue" to re-render images.',
      'Download individual results or compile into a ZIP bundle.'
    ],
    benefits: [
      'Correct sideways or upside-down smartphone photo captures in one sweep.',
      'Recalculate canvas boundaries dynamically without cropping valuable detail.',
      'Processes fully on your computer to safeguard confidential files.'
    ],
    faq: [
      { q: 'Will rotating images degrade their resolution?', a: 'No. The browser redraws the source pixels on a newly resized canvas matching the exact bounding rotation formulas.' },
      { q: 'Does this tool support bulk uploads?', a: 'Yes, you can upload and apply global rotation degrees to multiple images simultaneously.' }
    ],
    formats: ['PNG', 'JPG', 'JPEG', 'WEBP']
  },
  {
    id: 'flip-image',
    name: 'Flip Image',
    category: 'image-tools',
    path: '/image-tools/flip-image/',
    desc: 'Flip, mirror, or reverse multiple images horizontally or vertically in bulk.',
    seoTitle: 'Free Online Image Flip Tool — Mirror Pictures | ToolGenic',
    seoDesc: 'Flip images horizontally or vertically. Mirror multiple photos in bulk natively in your browser with live queue toggle controls.',
    iconName: 'ImageIcon',
    features: [
      'Interactive Horizontal (mirror) and Vertical (upside down) toggles',
      'Batch queue capability mirrors multiple uploaded photos simultaneously',
      'Individual card toggle controls allow fine-grained local overrides',
      'High-performance browser canvas renders conversions instantly'
    ],
    steps: [
      'Select or drop multiple images into the file workspace.',
      'Toggle the global Horizontal or Vertical mirror options.',
      'Adjust individual photo toggles in the queue lists if needed.',
      'Click "Flip Queue Now" to execute.',
      'Save your mirrored assets individually or download them as a ZIP.'
    ],
    benefits: [
      'Perfect for correcting mirrored camera captures or creating symetrical layouts.',
      'Mirror hundreds of photos in seconds without server-side delays.',
      'Maintains 100% data safety as everything compiles in-browser.'
    ],
    faq: [
      { q: 'Does flipping alter the pixel density or resolution?', a: 'No, mirroring simply reverses the horizontal or vertical canvas drawing matrices without resizing.' },
      { q: 'Is there a limit on how many photos I can upload?', a: 'No. The batch capacity is only limited by your computer\'s hardware.' }
    ],
    formats: ['PNG', 'JPG', 'JPEG', 'WEBP']
  },
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    category: 'image-tools',
    path: '/image-tools/add-watermark/',
    desc: 'Overlay custom text signatures or image logos onto photos with precision alignments.',
    seoTitle: 'Free Online Watermark Tool — Protect Your Images | ToolGenic',
    seoDesc: 'Add watermark text or logos to your images. Customize font sizes, colors, angles, opacities, and choose from 3x3 alignment grids.',
    iconName: 'Type',
    features: [
      'Support for custom text signatures and uploaded transparent PNG logos',
      'Interactive 3x3 alignment grid supports precise margin spacing',
      'Granular configuration of watermark opacity, font size, color, and angles',
      'Real-time high-fidelity canvas render displays exact previews instantly'
    ],
    steps: [
      'Upload the main photo you would like to watermark.',
      'Choose between "Text Copyright" or "Image Logo" watermarks.',
      'Customize characters, color, font size, opacity, and rotation angles.',
      'Select a placement position in the 3x3 alignment grid.',
      'Click "Download Watermarked Image" to save the composite asset.'
    ],
    benefits: [
      'Protect your artwork, photographs, and business documents from theft.',
      'Rapidly add transparent company branding or copyright notes to photos.',
      'Safeguards intellectual property without exposing files to external servers.'
    ],
    faq: [
      { q: 'What image formats can I upload as a watermark logo?', a: 'We highly recommend uploading a transparent PNG logo. However, standard JPG and WebP formats are also supported.' },
      { q: 'Is my original image safe?', a: 'Absolutely. Your high-resolution images are processed locally on your computer and never sent online.' }
    ],
    formats: ['PNG', 'JPG', 'JPEG', 'WEBP']
  },
  {
    id: 'video-compressor',
    name: 'Video Compressor',
    category: 'video-tools',
    path: '/video-tools/video-compressor/',
    desc: 'Compress and shrink video file sizes while retaining optimal HD visual quality.',
    seoTitle: 'Free Online Video Compressor — Shrink Video File Sizes | ToolGenic',
    seoDesc: 'Squeeze video files online in bulk. Custom target sizes, codecs, bitrates, resolutions, and frame rates. All rendered directly in your browser.',
    iconName: 'Video',
    features: [
      'Configurable compression levels from lightweight to extreme storage saver',
      'Choose custom resolutions from 480p to full high-definition 1080p',
      'Advanced bitrate controls and H.264/H.265/VP9 codec selection parameters',
      'Interactive visual side-by-side split screen to compare compression quality'
    ],
    steps: [
      'Upload or drag and drop your video file (MP4, WEBM, MOV, etc.).',
      'Select your desired compression level or target output file size in MB.',
      'Adjust optional settings like resolution, bitrate, frame rate, and codecs.',
      'Choose whether to preserve or remove the audio stream to save more space.',
      'Click "Compress Video" to run the local optimization process and download.'
    ],
    benefits: [
      'Shrink video files to bypass Email, Discord, Slack, and WhatsApp upload limits.',
      'Safe, private, browser-based transcribing without cloud server file uploads.',
      'Ultra fast multi-threaded progress tracking with custom frame previews.'
    ],
    faq: [
      { q: 'How does browser-side compression protect my privacy?', a: 'Your video files never leave your device. The browser executes all rendering and downsampling algorithms locally inside memory.' },
      { q: 'Can I target a specific file size (e.g., under 25MB)?', a: 'Yes! The compressor allows you to input a target size in megabytes and auto-calculates the perfect bitrates.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI']
  },
  {
    id: 'video-converter',
    name: 'Video Converter',
    category: 'video-tools',
    path: '/video-tools/video-converter/',
    desc: 'Convert videos between MP4, MOV, AVI, MKV, WEBM, and other formats instantly.',
    seoTitle: 'Free Online Video Converter — Convert Video Formats Natively | ToolGenic',
    seoDesc: 'Convert video files to MP4, MKV, WEBM, AVI, FLV, WMV, and MPEG. Batch process file formats directly in your browser with custom codec settings.',
    iconName: 'RefreshCw',
    features: [
      'Batch convert multiple video files in parallel sequential worker threads',
      'Full custom control over output resolution, video codecs, and bitrate profiles',
      'Support for highly optimized H.264, WebM/VP9, and modern AV1 encoders',
      'Maintains exact video dimensions or scales to custom dimensions'
    ],
    steps: [
      'Select or drag-and-drop multiple video files into the upload zone.',
      'Choose your preferred target format (e.g., MP4, WEBM, MKV, AVI, etc.).',
      'Optionally fine-tune audio/video encoders, frame rates, and quality settings.',
      'Click "Convert All" to initiate the secure in-browser conversion.',
      'Download individual converted videos or bundle them into a single ZIP.'
    ],
    benefits: [
      'Ensures your video clips play perfectly on smartphones, TVs, and web browsers.',
      'No registration or file size caps. 100% private conversion inside your browser.',
      'Bypass long queue times and upload bandwidth constraints on cloud converters.'
    ],
    faq: [
      { q: 'Is there any quality loss during video format conversion?', a: 'You can customize the quality slider to "Lossless" or 100% to preserve the original visual fidelity during conversion.' },
      { q: 'Can I convert videos on mobile devices?', a: 'Yes, our responsive converter works on any modern iOS or Android browser without installing external apps.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'AVI', 'MKV', 'FLV', 'WMV', 'MPEG']
  },
  {
    id: 'video-trimmer',
    name: 'Video Trimmer',
    category: 'video-tools',
    path: '/video-tools/video-trimmer/',
    desc: 'Trim, cut, and slice videos to exact timeline start and end timestamps.',
    seoTitle: 'Free Online Video Trimmer — Cut Video Clips Instantly | ToolGenic',
    seoDesc: 'Trim and cut videos online with frame-accurate timeline sliders. Crop the perfect start and end timestamps and preview clips in real-time.',
    iconName: 'Sliders',
    features: [
      'Fully interactive timeline slider with microsecond precision handle markers',
      'Live real-time media player syncing showing exact frames as you drag',
      'Manual input timestamp selectors for down-to-the-millisecond precision',
      'Ultra fast slicing process exports clips without re-encoding to preserve quality'
    ],
    steps: [
      'Select or drag-and-drop the video you wish to trim.',
      'Drag the timeline start and end handles to frame your desired clip.',
      'Use the play controls to preview the selected video segment.',
      'Fine-tune the cut with manual duration text inputs.',
      'Click "Trim Video" to clip and save your file locally.'
    ],
    benefits: [
      'Quickly cut out unwanted intros, outros, and mistakes from recorded files.',
      'Super lightweight export runs locally without draining mobile data bandwidth.',
      'Safe, offline editing prevents confidential footage from leaking online.'
    ],
    faq: [
      { q: 'Does trimming a video reduce its quality?', a: 'No, our trimmer uses stream-copying techniques when matching codecs, preserving original resolution and pixels exactly.' },
      { q: 'How long of a video can I upload?', a: 'Because the file is loaded into the local browser sandbox, you can edit large files limited only by your device memory.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI']
  },
  {
    id: 'merge-videos',
    name: 'Merge Videos',
    category: 'video-tools',
    path: '/video-tools/merge-videos/',
    desc: 'Combine and merge multiple video files into a single video file.',
    seoTitle: 'Free Online Video Merger — Combine Multiple Videos | ToolGenic',
    seoDesc: 'Combine multiple videos into one file. Drag-and-drop to reorder, normalize resolutions, standardize frame rates, and export seamless compilations.',
    iconName: 'Layers',
    features: [
      'Interactive visual canvas cards with drag-to-reorder sequence controls',
      'Resolution normalizer automatically matches and standardizes clip heights',
      'FPS stabilizer ensures smooth transitions and eliminates frame drops',
      'Instant interactive combined timeline preview before starting the merge'
    ],
    steps: [
      'Upload two or more video clips you would like to combine.',
      'Drag and reposition the video cards to organize their playing order.',
      'Configure output parameters like matching the first video or highest resolution.',
      'Review the sequential compilation layout in the interactive preview.',
      'Click "Merge Videos" to compound and download the compiled file.'
    ],
    benefits: [
      'Perfect for stitching camera takes, vlogs, and presentation slides together.',
      'No file limits or watermarks are ever injected into your final outputs.',
      'Entirely secure — compilation runs directly inside your computer.'
    ],
    faq: [
      { q: 'Do the merged videos need to have the same format?', a: 'No, you can upload a mix of MP4, WebM, and MOV files. The engine normalizes and binds them into a single coherent stream.' },
      { q: 'How long does the merging process take?', a: 'For files with matching dimensions, merging is nearly instantaneous. Normalizing resolutions adds a brief localized render.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI']
  },
  {
    id: 'crop-video',
    name: 'Crop Video',
    category: 'video-tools',
    path: '/video-tools/crop-video/',
    desc: 'Crop video dimensions to custom sizes and social media aspect ratios.',
    seoTitle: 'Free Online Video Cropper — Crop Video Dimensions | ToolGenic',
    seoDesc: 'Crop video sizes with custom aspect ratios. Presets for Instagram, TikTok, YouTube Shorts, and Facebook. Perfect visual boundaries, 100% locally.',
    iconName: 'Video',
    features: [
      'Draggable and resizable visual crop box overlaying the video player',
      'Instant ratio templates: Square 1:1, Vertical 9:16, Landscape 16:9, and Portrait 4:5',
      'Optimized settings for Instagram Posts, TikTok, YouTube Shorts, and Zoom',
      'Real-time output preview box displays cropped frame coordinates'
    ],
    steps: [
      'Upload the video clip you would like to crop.',
      'Select a platform preset ratio or click custom to drag the box freely.',
      'Slide the crop frame to center the active subject in the shot.',
      'Configure visual scaling and fitting choices in the setup panel.',
      'Click "Crop & Export Video" to crop, render, and download.'
    ],
    benefits: [
      'Easily reframe landscape widescreen videos into vertical TikToks or Shorts.',
      'Discard black borders or distracting elements from recorded screens.',
      'Natively processed in-browser to safeguard personal and business files.'
    ],
    faq: [
      { q: 'Can I crop the video to custom pixel dimensions?', a: 'Yes, select the custom mode to freely drag the crop handles to any pixel grid sizing you require.' },
      { q: 'Does cropping change the video duration?', a: 'No, cropping only alters the frame boundaries and width/height aspect ratios, leaving video duration intact.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI']
  },
  {
    id: 'rotate-video',
    name: 'Rotate Video',
    category: 'video-tools',
    path: '/video-tools/rotate-video/',
    desc: 'Rotate videos 90, 180, 270 degrees or flip horizontal and vertical.',
    seoTitle: 'Free Online Video Rotator — Rotate & Mirror Clips | ToolGenic',
    seoDesc: 'Rotate videos 90, 180, and 270 degrees clockwise or mirror them. Correct inverted recordings and flip clips horizontal/vertical in-browser.',
    iconName: 'Video',
    features: [
      'Quick-click rotation presets: 90° Clockwise, 180° Inverted, and 270° Counter-Clockwise',
      'Horizontal Mirroring and Vertical Flip toggles with real-time feedback',
      'Adaptive rendering ensures output boundaries stretch to fit rotated clips',
      'Lossless stream rotation metadata flags or full canvas re-rendering'
    ],
    steps: [
      'Select or drag-and-drop your video file into the work space.',
      'Click rotation buttons or mirror toggles to adjust the orientation.',
      'Verify the corrected orientation in the live interactive player.',
      'Choose whether to transcode the pixels or update rotation flags.',
      'Click "Rotate Video" to process and save your oriented file.'
    ],
    benefits: [
      'Easily repair upside-down or sideways smartphone landscape recordings.',
      'Flip videos horizontally to fix mirror-image selfie camera captures.',
      'Processed client-side in seconds with no server queues or data transfers.'
    ],
    faq: [
      { q: 'Why do phone videos sometimes upload sideways?', a: 'This occurs because cameras write "orientation tags" into metadata instead of shifting pixels. This tool helps burn the rotation permanently.' },
      { q: 'Will rotating reduce video quality?', a: 'No, our encoder matches original quality values and simply applies a coordinate transformation to the pixel grid.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI']
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF',
    category: 'video-tools',
    path: '/video-tools/video-to-gif/',
    desc: 'Convert video clips into high-quality animated GIF files natively.',
    seoTitle: 'Free Online Video to GIF Converter — Create Animated GIFs | ToolGenic',
    seoDesc: 'Convert video files to animated GIFs. Choose exact start and end times, adjust FPS, resolutions, loops, and quality sliders offline.',
    iconName: 'Video',
    features: [
      'Timeline trimmer isolates precise video sections to convert to GIF',
      'Configurable frame rates (5 FPS to 24 FPS) for smooth animation playback',
      'Output resolution scaling from small badges to full-width blog graphics',
      'Adjustable looping toggles and optimized dithering color palette options'
    ],
    steps: [
      'Upload the video file you would like to transcode.',
      'Use the timeline sliders to select a short segment (recommended < 15 seconds).',
      'Configure GIF resolution width, frame rate, and compression levels.',
      'Enable loop mode so the resulting GIF animation repeats continuously.',
      'Click "Convert to GIF" to compile the file and download.'
    ],
    benefits: [
      'Create custom reaction GIFs, meme stickers, and website animations.',
      'Zero external server processing. Safe, client-side rendering.',
      'Highly optimized compression options yield small, shareable GIF files.'
    ],
    faq: [
      { q: 'Why is my converted GIF file size so large?', a: 'GIFs are uncompressed frame sequences. To reduce file size, lower the FPS, decrease output dimensions, or shorten the clip length.' },
      { q: 'Can I convert any video format to GIF?', a: 'Yes, our local converter supports MP4, WebM, MOV, and AVI formats.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI', 'GIF']
  },
  {
    id: 'gif-to-mp4',
    name: 'GIF to MP4',
    category: 'video-tools',
    path: '/video-tools/gif-to-mp4/',
    desc: 'Convert heavy animated GIF files into lightweight modern MP4 videos.',
    seoTitle: 'Free Online GIF to MP4 Converter — Convert GIFs to Video | ToolGenic',
    seoDesc: 'Convert heavy animated GIFs to compressed MP4 videos. Customize output resolution, frame rates, loop parameters, and save bandwidth in-browser.',
    iconName: 'RefreshCw',
    features: [
      'Lossy H.264 video encoding converts flat GIF layers to high-fidelity MP4',
      'Loop multiplier duplicates GIF playing loops to extend video duration',
      'Configurable frame rates stabilize uneven and jerky GIF intervals',
      'Dramatically shrinks file sizes by up to 90% for web performance'
    ],
    steps: [
      'Select or drop your animated GIF file into the upload frame.',
      'Set your target resolution scaling and output frame rate.',
      'Choose the loop count to repeat the animation in the MP4 file.',
      'Click "Convert GIF to MP4" to trigger the local video compiler.',
      'Save your lightweight, universally compatible MP4 video file.'
    ],
    benefits: [
      'Reduces heavy GIFs to lightweight MP4s, saving up to 90% bandwidth.',
      'Allows placing animated clips on platforms that only support standard video.',
      'Secure, fully local browser processing keeps your visual assets private.'
    ],
    faq: [
      { q: 'Why convert an animated GIF to MP4?', a: 'MP4 uses advanced inter-frame compression, making files significantly smaller and faster to load than legacy GIF formats.' },
      { q: 'Is there any limit to the file size I can upload?', a: 'No, because the compilation is executed inside your browser, there are no strict size or bandwidth limits.' }
    ],
    formats: ['GIF', 'MP4']
  },
  {
    id: 'extract-audio',
    name: 'Extract Audio from Video',
    category: 'video-tools',
    path: '/video-tools/extract-audio/',
    desc: 'Extract high-fidelity audio streams from video files to MP3, WAV, or AAC.',
    seoTitle: 'Free Online Audio Extractor — Extract Audio from Video | ToolGenic',
    seoDesc: 'Extract audio from videos to MP3, WAV, AAC, FLAC, OGG, and M4A. Customize bitrates up to 320kbps, sample rates, and clip lengths natively.',
    iconName: 'Music',
    features: [
      'Extract soundtracks to MP3, studio-grade WAV, AAC, FLAC, OGG, or M4A',
      'Custom audio quality bitrates from 96kbps up to professional 320kbps',
      'Adjustable sample rate frequencies from 22.05kHz up to 48kHz',
      'Timeline selection tools isolate specific scenes for audio ripping'
    ],
    steps: [
      'Upload the video clip containing the soundtrack you want to extract.',
      'Select your preferred output audio format (e.g., MP3 for sharing, WAV for lossless).',
      'Adjust quality parameters like audio bitrates and frequency channels.',
      'Optionally trim the video to rip audio from a specific segment only.',
      'Click "Extract Audio" to instantly transcode and download your audio file.'
    ],
    benefits: [
      'Quickly save speech, sound effects, background tracks, and voice clips.',
      'Works completely offline, preserving your private videos on your computer.',
      'Extract pure studio-fidelity tracks without compression loss.'
    ],
    faq: [
      { q: 'What is the best format for high-quality audio extraction?', a: 'For lossless archiving, choose WAV or FLAC. For standard playback and device compatibility, MP3 at 320kbps is ideal.' },
      { q: 'Can I rip audio from short clips?', a: 'Yes! The extractor handles video files of any length, and processes short clips in fractions of a second.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'M4A']
  },
  {
    id: 'change-video-speed',
    name: 'Change Video Speed',
    category: 'video-tools',
    path: '/video-tools/change-video-speed/',
    desc: 'Speed up or slow down videos with advanced audio pitch correction controls.',
    seoTitle: 'Free Online Video Speed Changer — Fast & Slow Motion | ToolGenic',
    seoDesc: 'Change video speed from 0.25x slow motion to 4x fast forward. Preserve original audio pitch, mute audio, and download clips in-browser.',
    iconName: 'Sliders',
    features: [
      'Speed rate options: 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, and 4x',
      'Preserve Audio Pitch toggle prevents funny high or low voice squeaks',
      'Mute audio stream toggle easily strips soundtracks for silent clips',
      'Real-time speed interactive player plays adjusted velocities instantly'
    ],
    steps: [
      'Upload or drag your video file to the control workspace.',
      'Select a preset speed multiplier (e.g., 0.5x for slow-mo, 2x for double speed).',
      'Toggle "Preserve Audio Pitch" to maintain correct vocal tones, or select Mute.',
      'Preview the speed adjustments inside the live synced media player.',
      'Click "Export Video" to process the speed adjustments and download.'
    ],
    benefits: [
      'Create dramatic slow-motion highlights or fast-forward time-lapses.',
      'Adjust instructional webinars and recordings to comfortable viewing paces.',
      '100% private in-browser speed rendering protects your files locally.'
    ],
    faq: [
      { q: 'What does "Preserve Audio Pitch" do?', a: 'When speed is altered, audio naturally gets high-pitched (like a chipmunk) or low-pitched. Pitch correction keeps voices sounding natural.' },
      { q: 'Does changing video speed affect the resolution?', a: 'No. The video resolution, codecs, and aspect ratio remain exactly identical to your original upload.' }
    ],
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI']
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'calculators',
    path: '/calculators/age-calculator/',
    desc: 'Calculate your exact age in years, months, days, hours, and find upcoming birthday countdown.',
    seoTitle: 'Free Age Calculator — Calculate Exact Age in Years, Months, Days | ToolGenic',
    seoDesc: 'Calculate your exact age in years, months, days, weeks, hours, minutes and seconds. Find out your weekday of birth and upcoming birthday countdown in-browser.',
    iconName: 'Calculator',
    features: [
      'Find age down to years, months, and days',
      'Calculate total days, hours, minutes, and seconds lived',
      'Shows upcoming birthday countdown timer',
      'Discover the day of the week you were born'
    ],
    steps: [
      'Select your Date of Birth in the date picker.',
      'Choose the "Age at Date" (defaults to today).',
      'Click Calculate to reveal detailed age metrics and countdowns.'
    ],
    benefits: [
      'No registration required — calculate instantly',
      'Completely local, secure, and private browser processing',
      'Helps in filling out official application forms requiring precise age'
    ],
    faq: [
      { q: 'How is the age calculated?', a: 'The tool calculates the difference between your date of birth and the chosen target date. It takes leap years and variable month lengths into account to give an exact breakdown of years, months, and days.' },
      { q: 'Is my personal birth date secure?', a: 'Yes, 100%. The calculation is performed entirely client-side in your browser\'s memory. No personal dates are transmitted to any server.' }
    ],
    formats: ['Date', 'Years', 'Months', 'Days']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculators',
    path: '/calculators/percentage-calculator/',
    desc: 'Quickly solve percentage values, percentage differences, and percentage increases/decreases.',
    seoTitle: 'Free Percentage Calculator — Solve Percentage, Change & Diff | ToolGenic',
    seoDesc: 'Calculate percentages with ease. Includes multi-mode tools: what is X% of Y, X is what percent of Y, percentage change from X to Y, and value addition/subtraction.',
    iconName: 'Calculator',
    features: [
      'Calculate X% of Y instantly',
      'Find what percentage X is of Y',
      'Determine percentage increase or decrease between two values',
      'Add or subtract a percentage directly from any number'
    ],
    steps: [
      'Choose the percentage calculation sub-mode that matches your query.',
      'Enter the numerical values in the dedicated inputs.',
      'View the calculated results immediately updated in real-time.'
    ],
    benefits: [
      'Extremely useful for tax, shopping discounts, business growth, and school homework',
      'Instant interactive calculation with clear mathematical steps',
      'Works completely offline with clean desktop and mobile-responsive controls'
    ],
    faq: [
      { q: 'What is percentage change?', a: 'Percentage change represents the relative difference between an old value and a new value. A positive change indicates an increase, while a negative change represents a decrease.' },
      { q: 'How is percentage calculated?', a: 'Generally, a percentage is a number represented as a fraction of 100. It is calculated by dividing the part by the whole and multiplying by 100.' }
    ],
    formats: ['%', 'Number']
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    category: 'calculators',
    path: '/calculators/emi-calculator/',
    desc: 'Calculate monthly Equated Monthly Installments (EMI) for home, car, or personal loans.',
    seoTitle: 'Free EMI Calculator — Calculate Loan EMI & Amortization | ToolGenic',
    seoDesc: 'Calculate monthly EMIs for any home, auto, or personal loan. View interactive principal vs interest charts, amortization schedules, and interest totals.',
    iconName: 'Calculator',
    features: [
      'Instant loan EMI calculation with detailed totals',
      'Interactive visual Pie Chart for principal vs interest breakdown',
      'Monthly and annual amortization schedule with balance table',
      'Supports home, car, personal, and education loans'
    ],
    steps: [
      'Enter the target loan principal amount.',
      'Input the annual interest rate percentage.',
      'Enter the loan tenure in years or months.',
      'Analyze the EMI output, total interest payable, and amortization timeline.'
    ],
    benefits: [
      'Helps make sound financial planning decisions before borrowing',
      'Provides a comprehensive breakdown of total payable interest vs original principal',
      'Visualizes loan repayment progress over time'
    ],
    faq: [
      { q: 'What is an EMI?', a: 'An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.' },
      { q: 'How is the EMI calculated?', a: 'EMI is calculated using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is principal, R is monthly interest rate, and N is tenure in months.' }
    ],
    formats: ['Currency', 'Years', 'Months']
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    category: 'calculators',
    path: '/calculators/gst-calculator/',
    desc: 'Calculate Goods and Services Tax (GST) easily for inclusive and exclusive values.',
    seoTitle: 'Free GST Calculator — Add or Remove GST Instantly | ToolGenic',
    seoDesc: 'Calculate Goods and Services Tax (GST) online. Easily add GST (exclusive) or remove GST (inclusive) with standardized tax slab presets.',
    iconName: 'Calculator',
    features: [
      'Add GST (Exclusive) and Remove GST (Inclusive) modes',
      'Standardized tax slab presets (5%, 12%, 18%, 28%) plus custom rates',
      'Dual CGST (Central GST) and SGST (State GST) split breakdowns',
      'Real-time results as you type'
    ],
    steps: [
      'Input the base amount.',
      'Select a GST percentage rate slab or enter a custom rate.',
      'Toggle between "Add GST (Exclusive)" and "Remove GST (Inclusive)" options.',
      'View Net Amount, CGST, SGST, Total Tax, and Gross Amount instantly.'
    ],
    benefits: [
      'Perfect for business owners, accountants, shoppers, and service providers',
      'Saves time by performing CGST/SGST separations automatically',
      'Provides clear calculations with formulas explained'
    ],
    faq: [
      { q: 'What is CGST and SGST?', a: 'CGST stands for Central Goods and Services Tax, and SGST stands for State Goods and Services Tax. In dual-tax GST systems (like India), GST is split equally between the Central and State governments.' },
      { q: 'What is GST inclusive vs exclusive?', a: 'Exclusive GST means the tax is calculated on top of the base amount. Inclusive GST means the tax amount is already included in the final purchase price, and we backtrack to find the net base value.' }
    ],
    formats: ['Currency', '%']
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calculators',
    path: '/calculators/bmi-calculator/',
    desc: 'Calculate your Body Mass Index (BMI) and determine healthy weight ranges.',
    seoTitle: 'Free BMI Calculator — Calculate Body Mass Index Natively | ToolGenic',
    seoDesc: 'Calculate Body Mass Index (BMI) for adults. Supports Metric (kg/cm) and Imperial (lbs/ft/in) systems, healthy weight ranges, and interactive health gauge.',
    iconName: 'Calculator',
    features: [
      'Supports both Metric (kg/cm) and Imperial (lbs/ft/in) units',
      'Dynamic color-coded visual health gauge slider',
      'Provides accurate BMI categories (Underweight, Normal, Overweight, Obese)',
      'Calculates customized ideal weight range for your height'
    ],
    steps: [
      'Choose Metric or Imperial measurement tab.',
      'Enter your weight and height.',
      'Read your BMI score, medical category, and tailored health tips.'
    ],
    benefits: [
      'Gain immediate awareness of weight category health risks',
      'Completely secure — your physical metrics never leave your device',
      'Includes practical guidelines based on WHO health recommendations'
    ],
    faq: [
      { q: 'What is Body Mass Index (BMI)?', a: 'BMI is a simple measurement of a person\'s weight relative to their height, used as a screening tool to classify underweight, healthy weight, overweight, and obesity.' },
      { q: 'Is BMI accurate for everyone?', a: 'BMI is a general guideline. It may not be completely accurate for bodybuilders, athletes, pregnant women, or the elderly, as it does not directly measure body fat percentage vs muscle mass.' }
    ],
    formats: ['kg', 'lbs', 'cm', 'in']
  },
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    category: 'calculators',
    path: '/calculators/loan-calculator/',
    desc: 'Comprehensive loan calculator to estimate payments, interest, and the impact of extra prepayments.',
    seoTitle: 'Free Loan Calculator — Estimate Repayments & Prepayments | ToolGenic',
    seoDesc: 'Calculate repayments for housing, commercial, or automotive loans. Explore prepayment benefits, extra monthly options, and total interest savings.',
    iconName: 'Calculator',
    features: [
      'Calculate monthly principal and interest loan repayments',
      'Prepayment simulator showing interest saved and tenure reduced',
      'Dynamic area charts depicting remaining balance over the years',
      'Comprehensive annual amortization and breakdown logs'
    ],
    steps: [
      'Enter your total Loan Principal Amount, Interest Rate, and Tenure.',
      'Optionally specify extra monthly payments or one-time annual prepayments.',
      'Review how much interest you save and how many months you shave off the loan.'
    ],
    benefits: [
      'Model exact financial scenarios to pay off debts faster',
      'Visualize loan equity growth year-over-year with interactive charts',
      'Analyze exact amortization details'
    ],
    faq: [
      { q: 'How do extra prepayments reduce loan costs?', a: 'Prepayments go directly towards reducing your loan\'s principal balance. Since interest is calculated on the remaining principal, lowering it reduces total interest charges and shortens tenure.' },
      { q: 'What is amortization?', a: 'Amortization is the process of spreading out a loan into a series of equal periodic payments. Over time, the interest portion of each payment decreases while the principal portion increases.' }
    ],
    formats: ['Currency', '%', 'Years']
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    category: 'calculators',
    path: '/calculators/sip-calculator/',
    desc: 'Estimate the future value of your Systematic Investment Plan (SIP) mutual funds.',
    seoTitle: 'Free SIP Calculator — Mutual Fund Wealth Compounder | ToolGenic',
    seoDesc: 'Estimate compounding wealth from Systematic Investment Plans (SIP). Calculate future value, total invested capital, and total returns with visual growth charts.',
    iconName: 'Calculator',
    features: [
      'Instant calculation of compounding mutual fund returns',
      'Visualizes wealth growth via interactive stacked Recharts area charts',
      'Year-by-year investment breakdown and wealth compounding tables',
      'Custom investment intervals, return rates, and durations'
    ],
    steps: [
      'Input your proposed monthly SIP installment amount.',
      'Enter the expected annual compound return rate percentage.',
      'Select the time horizon in years.',
      'Visualize your total accumulated corpus, invested capital, and capital gains.'
    ],
    benefits: [
      'Demonstrates the power of compounding over long-term investment horizons',
      'Assists in establishing realistic financial goals and monthly saving quotas',
      'Interactive sliders allow rapid scenario testing'
    ],
    faq: [
      { q: 'What is a Systematic Investment Plan (SIP)?', a: 'An SIP is a method of investing a fixed sum of money regularly in financial instruments (like mutual funds or stocks), helping build wealth systematically.' },
      { q: 'What is rupee-cost averaging?', a: 'By investing a fixed amount regularly, you purchase more units when prices are low and fewer units when prices are high. This averages out the cost of acquisition over time.' }
    ],
    formats: ['Currency', '%', 'Years']
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    category: 'calculators',
    path: '/calculators/scientific-calculator/',
    desc: 'Full-featured online scientific calculator supporting trigonometry, logarithms, power, and memory functions.',
    seoTitle: 'Free Online Scientific Calculator — Trigonometry & Logarithms | ToolGenic',
    seoDesc: 'A comprehensive, advanced online scientific calculator. Supports sine, cosine, tangent, exponents, logarithms, factorials, memory slots, and live equation history.',
    iconName: 'Calculator',
    features: [
      'Standard arithmetic plus trigonometric functions (sin, cos, tan, Rad/Deg)',
      'Advanced operations: square root, exponentiation, log, ln, factorials, Mod',
      'Equation memory storage (MC, MR, M+, M-, MS)',
      'Scrollable running calculation history'
    ],
    steps: [
      'Type equations using the interactive button pad or your keyboard.',
      'Toggle between Radians (Rad) and Degrees (Deg) for angles.',
      'Press "=" or "Enter" to solve. Click "C" to clear or "Back" to delete the last character.'
    ],
    benefits: [
      'Replaces the need for physical scientific calculators for students and engineers',
      'Highly responsive visual keyboard works perfectly on laptops and touch screens',
      'Maintains a local scrollable history log to track steps'
    ],
    faq: [
      { q: 'Does this calculator support keyboard input?', a: 'Yes! You can use standard number keys, operators (+, -, *, /), brackets, and the Enter key to calculate.' },
      { q: 'What is Radian vs Degree mode?', a: 'Radian and Degree are units of angle measurement. Degree mode is standard for basic geometry, while Radian mode is used in advanced physics and calculus.' }
    ],
    formats: ['Equation', 'Result']
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'calculators',
    path: '/calculators/discount-calculator/',
    desc: 'Calculate final prices, savings, tax addition, and double-stack discounts instantly.',
    seoTitle: 'Free Discount Calculator — Shopping Savings & Sales Tax | ToolGenic',
    seoDesc: 'Calculate bargain bargains with ease. Solve final prices with percentage discounts, secondary stackable discounts, and optional local sales tax.',
    iconName: 'Calculator',
    features: [
      'Calculate primary percentage discounts instantly',
      'Simulate secondary "stacked" discounts (e.g. 20% off, plus extra 10%)',
      'Calculate final price inclusive of customized sales tax percentages',
      'Provides exact financial breakdown of total savings'
    ],
    steps: [
      'Input the original price of the item.',
      'Enter the primary discount percentage.',
      'Optionally add a secondary discount or sales tax rate.',
      'Analyze the final price, total money saved, and final tax paid.'
    ],
    benefits: [
      'Perfect companion for Black Friday, seasonal clearance sales, and shopping malls',
      'Avoids confusing head-math calculations at checkout counters',
      'Supports secondary stacking which merchants frequently use'
    ],
    faq: [
      { q: 'How does double discounting work?', a: 'Double discounting applies the secondary discount to the already reduced price, not the original price. For example, $100 with "20% + 10% off" reduces to $80 first, then 10% off of $80 reduces it to $72.' },
      { q: 'Can I add sales tax to the calculation?', a: 'Yes. Our tool allows you to input your state or local sales tax rate, which is automatically calculated and added to the final discounted price.' }
    ],
    formats: ['Currency', '%']
  },
  {
    id: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    category: 'calculators',
    path: '/calculators/income-tax-calculator/',
    desc: 'Estimate your progressive income tax liability with USA, India, and custom bracket presets.',
    seoTitle: 'Free Income Tax Calculator — US & India Tax Slab Estimator | ToolGenic',
    seoDesc: 'Estimate your progressive income tax liability online. Supports USA (2024 Federal slabs for Single/Married) and India (FY 2024-25) regimes, custom bracket editing, and deductions.',
    iconName: 'Calculator',
    features: [
      'USA Federal Income Tax estimation (Single & Married filers presets)',
      'Indian Income Tax slabs (New default tax regime presets)',
      'Custom Bracket Builder to model any progressive tax system',
      'Itemized deductions subtraction to find true taxable income',
      'Interactive visual bar chart showing effective tax vs take-home'
    ],
    steps: [
      'Choose your tax jurisdiction system (USA, India, or Custom).',
      'Select your filing status (Single or Married Jointly if applicable).',
      'Enter your Gross Annual Income and any allowable deductions or exemptions.',
      'View your Taxable Income, total tax liability, effective tax rate, and take-home pay.'
    ],
    benefits: [
      'Quickly estimate tax liability without exposing sensitive financial records to servers',
      'Understand how your income is divided across progressive tax brackets (marginal slabs)',
      'Provides complete transparency of progressive math step-by-step'
    ],
    faq: [
      { q: 'What is progressive taxation?', a: 'Progressive taxation is a tax system where the tax rate increases as the taxable amount increases. Your income is divided into segments (slabs), and each segment is taxed at its own specific rate.' },
      { q: 'What is the difference between Gross Income and Taxable Income?', a: 'Gross income is your total earnings before any adjustments. Taxable income is your gross income minus allowable deductions, exemptions, and standard allowances, and is the actual amount used to calculate your tax.' }
    ],
    formats: ['Currency', 'Tax Slabs', '%']
  }
];

export function updateSeoTags(tool: ToolMetadata | null, category: CategoryMetadata | null) {
  if (typeof window === 'undefined') return;

  let title = 'ToolGenicHub — Free Online Utility Tools & Converters (100% Private)';
  let desc = `Access ${TOOLS.length} free online utility tools, image compressors, PDF splitters, unit converters, and developer formatters. All processed securely in your browser.`;
  let path = '/';

  const normalizedPath = window.location.pathname.replace(/\/$/, '');
  const isSitemap = normalizedPath === '/sitemap';
  const isAbout = normalizedPath === '/about';
  const isPrivacy = normalizedPath === '/privacy' || normalizedPath === '/privacy-policy';
  const isTerms = normalizedPath === '/terms' || normalizedPath === '/terms-and-conditions' || normalizedPath === '/terms-conditions';
  const isContact = normalizedPath === '/contact';

  if (tool) {
    title = tool.seoTitle.replace(/ToolGenic(?!Hub)/g, 'ToolGenicHub');
    desc = tool.seoDesc.replace(/ToolGenic(?!Hub)/g, 'ToolGenicHub');
    path = tool.path;
  } else if (category) {
    title = `${category.name} — Free Browser Utilities | ToolGenicHub`;
    desc = `${category.name} tools for you. ${category.desc} 100% secure client-side execution.`;
    path = category.path;
  } else if (isSitemap) {
    title = 'Sitemap — Explore All Free Utility Tools | ToolGenicHub';
    desc = `Browse the complete index of ${TOOLS.length} 100% free online utility tools on ToolGenicHub. Instant client-side calculators, video tools, PDF converters, and image editors.`;
    path = '/sitemap/';
  } else if (isAbout) {
    title = 'About ToolGenicHub — Our Mission, Vision & Free Tools Philosophy';
    desc = 'Learn about ToolGenicHub, a 100% free browser-based online utility platform with offline-first local processing and zero-server data storage.';
    path = '/about/';
  } else if (isPrivacy) {
    title = 'Privacy Policy — GDPR Compliant & 100% Browser Local Processing | ToolGenicHub';
    desc = 'Read the ToolGenicHub privacy policy. Your security is our highest priority: all tools operate locally in your browser memory with no data uploads.';
    path = '/privacy/';
  } else if (isTerms) {
    title = 'Terms & Conditions — Acceptable Use & Browser Local Execution | ToolGenicHub';
    desc = 'Review the terms and conditions for using ToolGenicHub. Free browser calculators, media editors, and converters for private sandboxed workflows.';
    path = '/terms/';
  } else if (isContact) {
    title = 'Contact Us — Professional Support & Feedback | ToolGenicHub';
    desc = 'Get in touch with the ToolGenicHub team. Send your custom converter suggestions, feedback on tools, or report issues for offline utilities.';
    path = '/contact/';
  }

  // Update DOM Title
  document.title = title;

  // Update Meta tags helper
  const updateMeta = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  updateMeta('description', desc);
  updateMeta('og:title', title, true);
  updateMeta('og:description', desc, true);
  updateMeta('og:url', `https://toolgenichub.com${path}`, true);
  updateMeta('og:image', 'https://toolgenichub.com/assets/og-image.png', true);
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', title);
  updateMeta('twitter:description', desc);

  // Update Canonical
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', `https://toolgenichub.com${path}`);

  // Inject JSON-LD Schema
  let schemaEl = document.getElementById('toolgenic-jsonld-schema');
  if (schemaEl) {
    schemaEl.remove();
  }

  const schemas: any[] = [];

  // WebSite SearchAction Schema for Homepage Sitelinks Searchbox
  if (!tool && !category && !isSitemap) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'ToolGenic',
      'url': 'https://toolgenichub.com/',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://toolgenichub.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });
  }

  // 1. Breadcrumb Schema
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://toolgenichub.com/' }
  ];
  if (category) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: category.name,
      item: `https://toolgenichub.com${category.path}`
    });
  } else if (isSitemap) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Sitemap',
      item: 'https://toolgenichub.com/sitemap/'
    });
  } else if (isAbout) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'About',
      item: 'https://toolgenichub.com/about/'
    });
  } else if (isPrivacy) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Privacy Policy',
      item: 'https://toolgenichub.com/privacy/'
    });
  } else if (isTerms) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Terms & Conditions',
      item: 'https://toolgenichub.com/terms/'
    });
  } else if (isContact) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Contact',
      item: 'https://toolgenichub.com/contact/'
    });
  }
  if (tool) {
    const catObj = CATEGORIES.find(c => c.id === tool.category);
    if (catObj) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: catObj.name,
        item: `https://toolgenichub.com${catObj.path}`
      });
    }
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: tool.name,
      item: `https://toolgenichub.com${tool.path}`
    });
  }

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  });

  // 2. SoftwareApplication Schema for Tools
  if (tool) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      operatingSystem: 'All',
      applicationCategory: tool.category === 'developer-tools' ? 'DeveloperApplication' : 'MultimediaApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    });

    // 3. FAQ Schema
    if (tool.faq && tool.faq.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a
          }
        }))
      });
    }
  }

  const script = document.createElement('script');
  script.id = 'toolgenic-jsonld-schema';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemas);
  document.head.appendChild(script);
}
