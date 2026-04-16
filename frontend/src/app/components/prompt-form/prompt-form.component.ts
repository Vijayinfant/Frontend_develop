import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="form-container glass-panel">
      
      <div class="form-header">
        <h2>Create New Prompt</h2>
        <p>Share your best AI image generation prompt with the community.</p>
      </div>

      <form [formGroup]="promptForm" (ngSubmit)="onSubmit()">
        
        <div class="form-group">
          <label class="form-label" for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            class="form-control" 
            formControlName="title" 
            placeholder="e.g. Cyberpunk Cityscapes in Neon"
          >
          <div *ngIf="promptForm.get('title')?.touched && promptForm.get('title')?.invalid" class="error-container">
            <small class="error-text" *ngIf="promptForm.get('title')?.errors?.['required']">Title is required.</small>
            <small class="error-text" *ngIf="promptForm.get('title')?.errors?.['minlength']">Title must be at least 3 characters.</small>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="content">Prompt Content</label>
          <textarea 
            id="content" 
            class="form-control" 
            rows="6" 
            formControlName="content"
            placeholder="A highly detailed 8k rendering of..."
          ></textarea>
          <div *ngIf="promptForm.get('content')?.touched && promptForm.get('content')?.invalid" class="error-container">
            <small class="error-text" *ngIf="promptForm.get('content')?.errors?.['required']">Content is required.</small>
            <small class="error-text" *ngIf="promptForm.get('content')?.errors?.['minlength']">Content must be at least 20 characters.</small>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="complexity">Complexity (1-10)</label>
          <input 
            type="number" 
            id="complexity" 
            class="form-control" 
            formControlName="complexity" 
            min="1" max="10"
          >
          <div class="complexity-bar">
            <div class="complexity-fill" [style.width.%]="(promptForm.get('complexity')?.value || 0) * 10"></div>
          </div>
          <div *ngIf="promptForm.get('complexity')?.touched && promptForm.get('complexity')?.invalid" class="error-container">
            <small class="error-text" *ngIf="promptForm.get('complexity')?.errors?.['required']">Complexity is required.</small>
            <small class="error-text" *ngIf="promptForm.get('complexity')?.errors?.['min']">Complexity must be at least 1.</small>
            <small class="error-text" *ngIf="promptForm.get('complexity')?.errors?.['max']">Complexity cannot exceed 10.</small>
          </div>
        </div>

        <div class="form-actions">
          <a routerLink="/" class="btn btn-outline">Cancel</a>
          <button type="submit" class="btn btn-primary" [disabled]="!promptForm.valid || isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create Prompt' }}
          </button>
        </div>

      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2.5rem;
    }

    .form-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-header h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: var(--text-secondary);
    }

    .error-container {
      min-height: 20px;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 120px;
    }

    .complexity-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      margin-top: 10px;
      overflow: hidden;
    }

    .complexity-fill {
      height: 100%;
      background: linear-gradient(to right, #3b82f6, #8b5cf6, #ef4444);
      transition: width 0.3s ease;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
  `]
})
export class PromptFormComponent {
  promptForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  onSubmit() {
    if (this.promptForm.valid) {
      this.isSubmitting = true;
      this.promptService.createPrompt(this.promptForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error creating prompt', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}
