import { Component } from '@angular/core';
import { AnimeSearchComponent } from './components/anime-table/anime-search.component';

@Component({
  selector: 'app-root',
  imports: [AnimeSearchComponent],
  standalone: true,
  template: `
    <section class="mx-auto max-w-[1680px]">
      <div class="bg-gray-400 p-10 pt-20">
        <app-anime-search class="mb-10" />

        <div>Editing anime</div>
      </div>
    </section>
  `,
  styles: [],
})
export class AppComponent {}
