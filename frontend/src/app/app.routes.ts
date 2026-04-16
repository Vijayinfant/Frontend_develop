import { Routes } from '@angular/router';
import { PromptListComponent } from './components/prompt-list/prompt-list.component';
import { PromptDetailComponent } from './components/prompt-detail/prompt-detail.component';
import { PromptFormComponent } from './components/prompt-form/prompt-form.component';

export const routes: Routes = [
  { path: '', component: PromptListComponent },
  { path: 'add', component: PromptFormComponent },
  { path: 'prompts/:id', component: PromptDetailComponent }
];
