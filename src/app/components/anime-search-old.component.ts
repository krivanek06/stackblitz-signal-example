import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { outputFromObservable, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { AnimeApiService } from '../services/anime-api.service';
import { AnimeData, AnimeGenres } from '../services/api.model';

@Component({
  selector: 'app-anime-search-old',
  template: `
    <!-- anime genres -->
    <div class="mb-4 flex h-16 gap-6 overflow-x-scroll overflow-y-clip">
      @for (genre of animeGenres(); track genre.mal_id) {
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
      <input matInput [formControl]="searchControl" />
      <mat-hint>At least 3 characters</mat-hint>
    </mat-form-field>

    <!-- display options -->
    <div class="grid gap-2">
      @if (searchedData().isLoading) {
        <div class="bg-gray-200 p-4 text-center">Loading...</div>
      } @else {
        @for (option of searchedData().data; track option.mal_id) {
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
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
})
export class AnimeSearchOldComponent {
  private readonly apiService = inject(AnimeApiService);

  readonly searchControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  readonly selectedGenresId = signal<number>(1);

  readonly selectedAnime$ = new Subject<AnimeData>();
  readonly selectedAnime = outputFromObservable(this.selectedAnime$);
  readonly animeGenres = toSignal(this.apiService.getAnimeGenres());
  readonly searchedData = toSignal(
    toObservable(this.selectedGenresId).pipe(
      switchMap((genderId) =>
        this.searchControl.valueChanges.pipe(
          filter((x) => x.length > 3),
          distinctUntilChanged(),
          debounceTime(300),
          // load from API
          switchMap((name) =>
            this.apiService.searchAnime(name, genderId).pipe(
              map((data) => ({ data, isLoading: false })),
              startWith({ data: [] as AnimeData[], isLoading: true }),
              catchError((e) => [{ data: [] as AnimeData[], error: e, isLoading: false }]),
            ),
          ),
          // listen on select and reset the data
          switchMap((result) =>
            this.selectedAnime$.pipe(
              map(() => ({ data: [] as AnimeData[], isLoading: false })),
              startWith(result),
            ),
          ),
          // initial result when genres are changed
          startWith({ data: [] as AnimeData[], isLoading: false }),
        ),
      ),
    ),
    { initialValue: { data: [] as AnimeData[], isLoading: false } },
  );

  animeDisplayWith(animeData: AnimeData): string {
    return animeData.title_english ?? animeData.title;
  }

  onGenresClick(genres: AnimeGenres): void {
    this.selectedGenresId.set(genres.mal_id);
  }

  onAnimeClick(animeData: AnimeData): void {
    this.selectedAnime$.next(animeData);
  }
}
