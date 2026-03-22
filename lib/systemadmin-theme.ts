/** Shared premium color tokens for ALL System Admin pages (Simplified 3-Color Strict Theme) */
export const THEME = {
  // === The 3 Requested User Colors ===
  mainBg: '#F9FAFB',
  cardBg: '#D7EEFC',
  hover:  '#BEE3F8',

  // === Mapped Backgrounds (Strictly using the 3 colors) ===
  border:        '#BEE3F8', // Hover color acts as border
  headerBg:      '#D7EEFC', // Header uses card bg or main bg
  rowHover:      '#BEE3F8', 

  // === Typography: Dark clean text (Need high contrast on light blue) ===
  titleColor:    '#111827', // standard dark text (Tailwind gray-900)
  subtitleColor: '#4B5563', // standard mid text (Tailwind gray-600)
  tableHeadText: '#1F2937', 
  monoText:      '#4B5563',

  // === Mapped Elements ===
  tableHeadBg:   '#BEE3F8',
  codeChipBg:    '#BEE3F8',
  codeChipText:  '#111827',

  // === Form Inputs ===
  inputBg:       '#F9FAFB',
  inputBorder:   '#BEE3F8',
  inputText:     '#111827',
} as const;
