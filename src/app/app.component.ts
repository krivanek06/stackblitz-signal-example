import { Component } from '@angular/core';
import { AnimeSearchNewComponent } from './components/new-way/anime-search-new.component';
import { AnimeSearchOldComponent } from './components/old-way/anime-search-old.component';

@Component({
  selector: 'app-root',
  imports: [AnimeSearchOldComponent, AnimeSearchNewComponent],
  standalone: true,
  template: `
    <section class="mx-auto max-w-[1680px]">
      <div class="grid grid-cols-2 gap-4 bg-gray-400 p-10 pt-20">
        <div>
          <h2>New Way</h2>
          <app-anime-search-new />
        </div>

        <div>
          <h2>Old Way</h2>
          <app-anime-search-old />
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class AppComponent {}
