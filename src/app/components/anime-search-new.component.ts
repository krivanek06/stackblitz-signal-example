import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, linkedSignal, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { of } from 'rxjs';
import { AnimeApiService } from '../services/anime-api.service';
import { AnimeData, AnimeDataAPI, AnimeGenres } from '../services/api.model';
import { ANIME_API } from '../services/constants.model';

@Component({
  selector: 'app-anime-search-new',
  template: `
    <!-- anime genres -->
    <div class="mb-4 flex h-16 gap-6 overflow-x-scroll overflow-y-clip">
      @for (genre of animeGenres.value().data; track genre.mal_id) {
        <button
          (click)="onGenresClick(genre)"
          mat-raised-button
          [color]="selectedGenresId() === genre.mal_id ? 'primary' : 'warn'"
          type="button"
        >
          {{ genre.name }}
        </button>
      }
    </div>

    <!-- search anime -->
    <mat-form-field>
      <mat-label>search anime</mat-label>
      <input matInput [(ngModel)]="searchControl" />
      <mat-hint>At least 3 characters</mat-hint>
    </mat-form-field>

    <!-- display options -->
    <div class="grid gap-2">
      @if (searchedDataResource.isLoading()) {
        <div class="bg-gray-200 p-4 text-center">Loading...</div>
      } @else {
        @for (option of searchedDataResource.value(); track option.mal_id) {
          <button mat-button type="button" class="rounded-lg bg-gray-200 p-4" (click)="onAnimeClick(option)">
            [{{ option.source }}]: {{ option.title_english ?? option.title }} ({{ option.duration }})
          </button>
        }
      }
    </div>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
})
export class AnimeSearchNewComponent {
  private readonly apiService = inject(AnimeApiService);

  readonly selectedAnime = output<AnimeData>();

  readonly searchControl = signal('');
  readonly selectedGenresId = signal<number>(1);

  readonly animeGenres = httpResource<AnimeDataAPI<AnimeGenres>>(
    () => ({
      method: ANIME_API.genres.method,
      url: ANIME_API.genres.url,
    }),
    { defaultValue: { data: [] } },
  );

  readonly searchedDataResource = rxResource({
    request: () => ({
      genresId: this.selectedGenresId(),
      prefix: this.searchControl(),
    }),
    loader: ({ request }) =>
      request.prefix.length > 3 ? this.apiService.searchAnime(request.prefix, request.genresId) : of([]),
  });

  readonly searchedDataLink = linkedSignal(() => this.searchedDataResource);

  animeDisplayWith(animeData: AnimeData): string {
    return animeData.title_english ?? animeData.title;
  }

  onGenresClick(genres: AnimeGenres): void {
    this.selectedGenresId.set(genres.mal_id);
  }

  onAnimeClick(animeData: AnimeData): void {
    this.selectedAnime.emit(animeData);
    this.searchedDataLink().value.set([]);
  }
}
