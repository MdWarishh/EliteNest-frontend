import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Message { role: 'user'|'assistant'; content: string; timestamp: Date; }
interface VizCredit { photographer: string; photographerUrl: string; unsplashUrl: string; }

@Component({ selector: 'app-ai', standalone: true, imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ai.component.html', styleUrls: ['./ai.component.scss'] })
export class AiComponent implements AfterViewChecked {
  @ViewChild('chatBox') chatBox!: ElementRef;

  activeTab = signal<'chat'|'visualize'|'color'|'budget'|'tips'>('chat');
  private shouldScroll = false;
  private apiBase = environment.apiUrl;

  // ── Chat ──────────────────────────────────────────────
  messages    = signal<Message[]>([{ role:'assistant', content:"👋 Hi! I'm EliteNest's AI Design Consultant. Ask me anything about interior design — styles, colours, furniture, budgets, or how to transform your space!", timestamp:new Date() }]);
  userInput   = signal('');
  chatLoading = signal(false);
  history: {role:string;content:string}[] = [];

  // ── Room Visualizer ───────────────────────────────────
  vizRoomType  = signal('Living Room');
  vizStyle     = signal('Modern Luxury');
  vizLoading   = signal(false);
  vizResult    = signal<string>('');
  vizCredit    = signal<VizCredit|null>(null);
  vizError     = signal('');
  vizRetry     = signal(false);

  vizRoomTypes = ['Living Room','Bedroom','Kitchen','Dining Room','Home Office','Bathroom','Entryway'];
  vizStyles    = [
    'Modern Luxury','Contemporary Minimalist','Classic Traditional','Bohemian Eclectic',
    'Scandinavian Clean','Industrial Chic','Japandi Zen','Art Deco Glamour',
    'Coastal Relaxed','Mid-Century Modern'
  ];

  // ── Colour Palette ────────────────────────────────────
  colorPrompt  = signal('');
  palette      = signal<{name:string;hex:string;use:string}[]>([]);
  paletteName  = signal('');
  paletteTip   = signal('');
  colorLoading = signal(false);
  colorError   = signal('');
  budgetError  = signal('');
  tipsError    = signal('');

  // ── Budget Estimator ──────────────────────────────────
  budgetForm    = { roomType:'Living Room', area:'', style:'Modern', quality:'Premium' };
  budgetResult  = signal<any>(null);
  budgetLoading = signal(false);
  roomTypes  = ['Living Room','Bedroom','Kitchen','Bathroom','Office','Dining Room','Full Home'];
  styles     = ['Modern','Classic','Contemporary','Minimalist','Luxury','Bohemian','Japandi'];
  qualities  = ['Budget','Standard','Premium','Ultra Luxury'];

  // ── Design Tips ───────────────────────────────────────
  tipsCategory  = signal('Living Room');
  tips          = signal<string[]>([]);
  tipsLoading   = signal(false);
  tipCategories = ['Living Room','Bedroom','Kitchen','Office','Small Spaces','Lighting','Colour Theory'];

  constructor(private http: HttpClient) {}

  ngAfterViewChecked() {
    if (this.shouldScroll && this.chatBox) {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      this.shouldScroll = false;
    }
  }

  // ── Chat ──────────────────────────────────────────────
  sendMessage() {
    const msg = this.userInput().trim(); if (!msg || this.chatLoading()) return;
    this.messages.update(m => [...m, {role:'user',content:msg,timestamp:new Date()}]);
    this.userInput.set(''); this.chatLoading.set(true); this.shouldScroll = true;
    this.http.post<any>(`${this.apiBase}/ai/chat`, {message:msg, conversationHistory:this.history}).subscribe({
      next: r => {
        const reply = r.data?.reply ?? 'Sorry, could not process that.';
        this.history = [...this.history, {role:'user',content:msg},{role:'assistant',content:reply}];
        if (this.history.length > 20) this.history = this.history.slice(-20);
        this.messages.update(m => [...m, {role:'assistant',content:reply,timestamp:new Date()}]);
        this.chatLoading.set(false); this.shouldScroll = true;
      },
      error: () => {
        this.messages.update(m => [...m, {role:'assistant',content:"I'm temporarily unavailable. Please try again shortly.",timestamp:new Date()}]);
        this.chatLoading.set(false);
      }
    });
  }
  onKeydown(e: KeyboardEvent) { if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); this.sendMessage(); } }

  // ── Room Visualizer ───────────────────────────────────
  generateRoom() {
    if (this.vizLoading()) return;
    this.vizLoading.set(true);
    this.vizResult.set('');
    this.vizCredit.set(null);
    this.vizError.set('');
    this.vizRetry.set(false);

    this.http.post<any>(`${this.apiBase}/ai/visualize-room`, {
      roomType: this.vizRoomType(),
      style:    this.vizStyle(),
    }).subscribe({
      next: r => {
        this.vizResult.set(r.data?.imageUrl ?? r.data?.thumbUrl ?? '');
        this.vizCredit.set(r.data?.credit ?? null);
        this.vizLoading.set(false);
      },
      error: (err) => {
        this.vizError.set(err?.error?.message ?? 'Failed to find images. Please try again.');
        this.vizRetry.set(true);
        this.vizLoading.set(false);
      }
    });
  }

  downloadViz() {
    const img = this.vizResult(); if (!img) return;
    const a = document.createElement('a');
    a.href = img;
    a.target = '_blank';
    a.download = `${this.vizRoomType()}-${this.vizStyle()}.jpg`.replace(/\s+/g,'-').toLowerCase();
    a.click();
  }

  // ── Colour Palette ────────────────────────────────────
  generatePalette() {
    if (!this.colorPrompt().trim() || this.colorLoading()) return;
    this.colorLoading.set(true); this.palette.set([]); this.paletteName.set(''); this.paletteTip.set(''); this.colorError.set('');
    this.http.post<any>(`${this.apiBase}/ai/color-palette`, {description: this.colorPrompt()}).subscribe({
      next: r => {
        this.palette.set(r.data?.palette ?? []);
        this.paletteName.set(r.data?.paletteName ?? '');
        this.paletteTip.set(r.data?.tip ?? '');
        this.colorLoading.set(false);
      },
      error: (err) => {
        this.colorError.set(err?.error?.message ?? 'Failed. Please try again.');
        this.colorLoading.set(false);
      }
    });
  }

  copyColor(hex: string) { navigator.clipboard?.writeText(hex).catch(() => {}); }

  // ── Budget ────────────────────────────────────────────
  estimateBudget() {
    if (!this.budgetForm.area || this.budgetLoading()) return;
    this.budgetLoading.set(true); this.budgetResult.set(null); this.budgetError.set('');
    this.http.post<any>(`${this.apiBase}/ai/budget-estimate`, this.budgetForm).subscribe({
      next: r => { this.budgetResult.set(r.data); this.budgetLoading.set(false); },
      error: (err) => {
        this.budgetError.set(err?.error?.message ?? 'Failed. Please try again.');
        this.budgetLoading.set(false);
      }
    });
  }

  // ── Tips ──────────────────────────────────────────────
  getTips() {
    this.tipsLoading.set(true); this.tips.set([]); this.tipsError.set('');
    this.http.post<any>(`${this.apiBase}/ai/design-tips`, {category: this.tipsCategory()}).subscribe({
      next: r => { this.tips.set(r.data?.tips ?? []); this.tipsLoading.set(false); },
      error: (err) => {
        this.tipsError.set(err?.error?.message ?? 'Failed. Please try again.');
        this.tipsLoading.set(false);
      }
    });
  }
}