// src/app/shared/components/confirm-modal/confirm-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal-backdrop" (click)="onCancel()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-box__icon">⚠</div>
          <h3 class="modal-box__title">{{ title }}</h3>
          <p class="modal-box__msg">{{ message }}</p>
          <div class="modal-box__actions">
            <button class="btn-cancel" (click)="onCancel()">Cancel</button>
            <button class="btn-confirm" (click)="onConfirm()" [disabled]="loading">
              @if (loading) { <span class="spinner"></span> }
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn .2s ease;
    }
    .modal-box {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 32px; width: 100%; max-width: 400px;
      text-align: center;
      animation: slideUp .25s ease;
      &__icon { font-size: 2rem; margin-bottom: 12px; }
      &__title { font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 8px; }
      &__msg { color: var(--color-text-muted); font-size: .9rem; margin-bottom: 24px; }
      &__actions { display: flex; gap: 12px; justify-content: center; }
    }
    .btn-cancel {
      padding: 10px 24px; background: var(--color-bg-hover);
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      color: var(--color-text-secondary); font-size: .875rem; cursor: pointer;
      transition: all .2s;
      &:hover { border-color: var(--color-border-light); color: var(--color-text-primary); }
    }
    .btn-confirm {
      padding: 10px 24px; background: var(--color-error);
      border: none; border-radius: var(--radius-md);
      color: #fff; font-size: .875rem; cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      transition: opacity .2s;
      &:hover:not(:disabled) { opacity: .85; }
      &:disabled { opacity: .6; cursor: not-allowed; }
    }
    .spinner {
      width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .7s linear infinite;
    }
    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes spin    { to { transform: rotate(360deg); } }
  `]
})
export class ConfirmModalComponent {
  @Input() visible  = false;
  @Input() title    = 'Are you sure?';
  @Input() message  = 'This action cannot be undone.';
  @Input() confirmText = 'Delete';
  @Input() loading  = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel  = new EventEmitter<void>();

  onConfirm() { this.confirm.emit(); }
  onCancel()  { this.cancel.emit(); }
}