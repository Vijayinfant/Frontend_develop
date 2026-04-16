import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="header-section">
      <h1 class="page-title">Discover Prompts</h1>
      <p class="page-subtitle">A curated collection of AI generation prompts</p>
    </div>

    <div class="prompts-grid" *ngIf="prompts.length > 0; else noPrompts">
      <div class="prompt-card glass-panel" *ngFor="let prompt of prompts" [routerLink]="['/prompts', prompt.id]">
        <div class="card-header">
          <h3 class="card-title">{{ prompt.title }}</h3>
          <span class="complexity-badge" title="Complexity Score">{{ prompt.complexity }}</span>
        </div>
        <p class="card-excerpt">{{ prompt.content.slice(0, 100) }}{{ prompt.content.length > 100 ? '...' : '' }}</p>
        <div class="card-footer">
          <span class="date">{{ prompt.created_at | date:'mediumDate' }}</span>
          <span class="btn-text">View Details →</span>
        </div>
      </div>
    </div>

    <ng-template #noPrompts>
      <div class="empty-state glass-panel">
        <div class="empty-icon">✨</div>
        <h3>No prompts found</h3>
        <p>Be the first to create an amazing AI image prompt!</p>
        <br>
        <a routerLink="/add" class="btn btn-primary">Create Prompt</a>
      </div>
    </ng-template>
  `,
  styles: [`
    .header-section {
      margin-bottom: 2rem;
    }
    
    .page-title {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(to right, #fff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .page-subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    .prompts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .prompt-card {
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .prompt-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      border-color: rgba(59, 130, 246, 0.3);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.4;
      margin: 0;
    }

    .card-excerpt {
      color: var(--text-secondary);
      flex-grow: 1;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
    }

    .date {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    .btn-text {
      color: var(--accent-primary);
      font-weight: 500;
      font-size: 0.9rem;
      transition: 0.2s;
    }

    .prompt-card:hover .btn-text {
      padding-right: 5px;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  `]
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (data) => this.prompts = data,
      error: (err) => console.error('Failed to load prompts', err)
    });
  }
}
