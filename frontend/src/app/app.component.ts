import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <div class="container">
      <header class="app-header">
        <a routerLink="/" class="app-logo">
          ✨ AI Prompts Matrix
        </a>
        <nav>
          <a routerLink="/" class="btn btn-outline" style="margin-right: 1rem;">Browse</a>
          <a routerLink="/add" class="btn btn-primary">+ New Prompt</a>
        </nav>
      </header>
      
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  title = 'frontend';
}
