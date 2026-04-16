import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="glass-panel detail-container" *ngIf="prompt">
      <div class="back-link">
        <a routerLink="/" class="btn-text">← Back to gallery</a>
      </div>
      
      <div class="detail-header">
        <h1 class="title">{{ prompt.title }}</h1>
        <div class="meta-tags">
          <div class="meta-tag views">
            <span class="icon">👁️</span> {{ prompt.view_count }} views
          </div>
          <div class="meta-tag complexity">
            Level {{ prompt.complexity }} Complexity
          </div>
          <div class="meta-tag date">
            {{ prompt.created_at | date:'medium' }}
          </div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-label">Prompt Content</div>
        <div class="prompt-box">
          {{ prompt.content }}
          
          <button class="copy-btn" (click)="copyToClipboard()">
            {{ copyText }}
          </button>
        </div>
      </div>
    </div>
    
    <div *ngIf="loading" class="loading-state">
       <div class="spinner"></div> Loading prompt...
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 2.5rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .back-link {
      margin-bottom: 2rem;
    }

    .btn-text {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
    }

    .btn-text:hover {
      color: white;
    }

    .title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .meta-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .meta-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 0.8rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .meta-tag.views {
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .section-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-secondary);
      margin-bottom: 0.8rem;
    }

    .prompt-box {
      background: var(--bg-primary);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      font-family: inherit;
      font-size: 1.1rem;
      line-height: 1.7;
      position: relative;
      white-space: pre-wrap;
    }

    .copy-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }

    .copy-btn:hover {
      background: var(--accent-primary);
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }
  `]
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  loading = true;
  copyText = 'Copy';

  constructor(
    private route: ActivatedRoute,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promptService.getPrompt(id).subscribe({
        next: (data) => {
          this.prompt = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching prompt', err);
          this.loading = false;
        }
      });
    }
  }

  copyToClipboard() {
    if (this.prompt) {
      navigator.clipboard.writeText(this.prompt.content).then(() => {
        this.copyText = 'Copied!';
        setTimeout(() => this.copyText = 'Copy', 2000);
      });
    }
  }
}
