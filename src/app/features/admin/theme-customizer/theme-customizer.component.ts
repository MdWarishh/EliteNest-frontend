import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ThemeColors { [key: string]: string; primaryGold:string; primaryGoldLight:string; bgMain:string; bgAlt:string; bgCard:string; bgDark:string; textPrimary:string; textSecondary:string; textMuted:string; borderColor:string; }
interface ThemeTypography { headingFont:string; bodyFont:string; baseFontSize:string; headingWeight:string; }
interface ThemeLayout { borderRadius:string; sectionPadding:string; maxWidth:string; }

const GOOGLE_FONTS = ['Cormorant Garamond','Playfair Display','Libre Baskerville','EB Garamond','Lora','Raleway','DM Sans','Inter','Poppins','Nunito','Josefin Sans','Montserrat'];

const PRESETS = [
  { name:'EliteNest Gold', icon:'✦', colors:{ primaryGold:'#b8934a', primaryGoldLight:'#d4ad6f', bgMain:'#f7f4ef', bgAlt:'#f0ebe3', bgCard:'#ffffff', bgDark:'#1a1612', textPrimary:'#1a1612', textSecondary:'#6b5e52', textMuted:'#a09080', borderColor:'#e8e0d5' }},
  { name:'Midnight Black', icon:'◆', colors:{ primaryGold:'#c9a84c', primaryGoldLight:'#e0c070', bgMain:'#0e0e0e', bgAlt:'#161616', bgCard:'#1a1a1a', bgDark:'#050505', textPrimary:'#f5f0e8', textSecondary:'#c4b8a8', textMuted:'#7a6e60', borderColor:'#2a2520' }},
  { name:'Rose Luxe',      icon:'❋', colors:{ primaryGold:'#c47a7a', primaryGoldLight:'#d9a0a0', bgMain:'#fdf6f6', bgAlt:'#f5ecec', bgCard:'#ffffff', bgDark:'#2a1515', textPrimary:'#2a1515', textSecondary:'#7a4a4a', textMuted:'#b08080', borderColor:'#ead8d8' }},
  { name:'Forest Sage',    icon:'❧', colors:{ primaryGold:'#5a8a6a', primaryGoldLight:'#7aaa8a', bgMain:'#f4f7f5', bgAlt:'#e8f0eb', bgCard:'#ffffff', bgDark:'#152015', textPrimary:'#152015', textSecondary:'#4a6a50', textMuted:'#8aaa90', borderColor:'#d5e5da' }},
  { name:'Ocean Blue',     icon:'◉', colors:{ primaryGold:'#4a7ab8', primaryGoldLight:'#6a9ad4', bgMain:'#f4f6fa', bgAlt:'#e8edf5', bgCard:'#ffffff', bgDark:'#0f1a2a', textPrimary:'#0f1a2a', textSecondary:'#4a5e78', textMuted:'#8aA0b8', borderColor:'#d5dde8' }},
  { name:'Royal Purple',   icon:'✿', colors:{ primaryGold:'#8a5ab8', primaryGoldLight:'#aa7ad4', bgMain:'#f8f5fc', bgAlt:'#f0eaf8', bgCard:'#ffffff', bgDark:'#1a0f2a', textPrimary:'#1a0f2a', textSecondary:'#5a4070', textMuted:'#9a80b8', borderColor:'#e0d5f0' }},
];

@Component({ selector:'app-theme-customizer', standalone:true, imports:[CommonModule,FormsModule],
  templateUrl:'./theme-customizer.component.html', styleUrls:['./theme-customizer.component.scss'] })
export class ThemeCustomizerComponent implements OnInit {
  private api = environment.apiUrl;
  saving    = signal(false);
  resetting = signal(false);
  saved     = signal(false);
  activeTab = signal<'colors'|'typography'|'layout'>('colors');
  fonts     = GOOGLE_FONTS;
  presets   = PRESETS;

  colors: ThemeColors = { primaryGold:'#b8934a', primaryGoldLight:'#d4ad6f', bgMain:'#f7f4ef', bgAlt:'#f0ebe3', bgCard:'#ffffff', bgDark:'#1a1612', textPrimary:'#1a1612', textSecondary:'#6b5e52', textMuted:'#a09080', borderColor:'#e8e0d5' };
  typography: ThemeTypography = { headingFont:'Cormorant Garamond', bodyFont:'DM Sans', baseFontSize:'16px', headingWeight:'300' };
  layout: ThemeLayout = { borderRadius:'12px', sectionPadding:'100px', maxWidth:'1280px' };

  colorFields = [
    { key:'primaryGold',       label:'Primary Accent',    group:'Brand' },
    { key:'primaryGoldLight',  label:'Accent Hover',      group:'Brand' },
    { key:'bgMain',            label:'Main Background',   group:'Backgrounds' },
    { key:'bgAlt',             label:'Alt Background',    group:'Backgrounds' },
    { key:'bgCard',            label:'Card Background',   group:'Backgrounds' },
    { key:'bgDark',            label:'Dark Background',   group:'Backgrounds' },
    { key:'textPrimary',       label:'Primary Text',      group:'Text' },
    { key:'textSecondary',     label:'Secondary Text',    group:'Text' },
    { key:'textMuted',         label:'Muted Text',        group:'Text' },
    { key:'borderColor',       label:'Borders & Dividers',group:'UI' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${this.api}/theme`).subscribe({
      next: r => {
        if (r.data?.colors)     this.colors     = { ...this.colors,     ...r.data.colors };
        if (r.data?.typography) this.typography = { ...this.typography, ...r.data.typography };
        if (r.data?.layout)     this.layout     = { ...this.layout,     ...r.data.layout };
      }
    });
  }

  applyPreset(preset: typeof PRESETS[0]) {
    this.colors = { ...this.colors, ...preset.colors };
    this.updatePreview();
  }

  updatePreview() {
    // Inject CSS variables into current page for live preview
    let style = document.getElementById('theme-preview-style');
    if (!style) { style = document.createElement('style'); style.id = 'theme-preview-style'; document.head.appendChild(style); }
    style.textContent = `
      .theme-preview-card {
        --prev-gold: ${this.colors.primaryGold};
        --prev-bg: ${this.colors.bgMain};
        --prev-bg-alt: ${this.colors.bgAlt};
        --prev-text: ${this.colors.textPrimary};
        --prev-text-sec: ${this.colors.textSecondary};
        --prev-border: ${this.colors.borderColor};
        --prev-dark: ${this.colors.bgDark};
        --prev-font-h: '${this.typography.headingFont}', serif;
        --prev-font-b: '${this.typography.bodyFont}', sans-serif;
        --prev-radius: ${this.layout.borderRadius};
      }`;
  }

  save() {
    this.saving.set(true);
    this.http.put<any>(`${this.api}/theme`, { colors: this.colors, typography: this.typography, layout: this.layout }).subscribe({
      next: () => {
        this.saving.set(false); this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
        // Apply to whole site immediately
        this.injectGlobalCSS();
      },
      error: () => this.saving.set(false)
    });
  }

  reset() {
    if (!confirm('Reset to default EliteNest theme?')) return;
    this.resetting.set(true);
    this.http.post<any>(`${this.api}/theme/reset`, {}).subscribe({
      next: r => {
        if (r.data?.colors)     this.colors     = { ...this.colors,     ...r.data.colors };
        if (r.data?.typography) this.typography = { ...this.typography, ...r.data.typography };
        if (r.data?.layout)     this.layout     = { ...this.layout,     ...r.data.layout };
        this.resetting.set(false);
        this.updatePreview();
      },
      error: () => this.resetting.set(false)
    });
  }

  private injectGlobalCSS() {
    let style = document.getElementById('elitenest-theme');
    if (!style) { style = document.createElement('style'); style.id = 'elitenest-theme'; document.head.appendChild(style); }
    style.textContent = `
:root {
  --pub-gold: ${this.colors.primaryGold};
  --pub-gold-light: ${this.colors.primaryGoldLight};
  --pub-gold-muted: ${this.colors.primaryGold}18;
  --pub-bg: ${this.colors.bgMain};
  --pub-bg-alt: ${this.colors.bgAlt};
  --pub-bg-card: ${this.colors.bgCard};
  --pub-bg-dark: ${this.colors.bgDark};
  --pub-text: ${this.colors.textPrimary};
  --pub-text-sec: ${this.colors.textSecondary};
  --pub-text-muted: ${this.colors.textMuted};
  --pub-border: ${this.colors.borderColor};
  --pub-radius: ${this.layout.borderRadius};
  --font-heading: '${this.typography.headingFont}', serif;
  --font-body: '${this.typography.bodyFont}', sans-serif;
}`;
  }

  groupFields(group: string) { return this.colorFields.filter(f => f.group === group); }
  colorGroups = ['Brand','Backgrounds','Text','UI'];
}
