import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { AnimeApiService } from '../../services/anime-api.service';
import { AnimeData, AnimeGenres } from '../../services/api.model';

@Component({
  selector: 'app-anime-search',
  template: `
    <!-- anime genres -->
    <div class="flex h-16 flex-wrap gap-6 overflow-x-scroll overflow-y-clip">
      @for (genre of animeGenres(); track genre.mal_id) {
        <button
          (click)="onGenresClick(genre)"
          mat-raised-button
          [color]="selectedGenresId() === genre.mal_id ? 'primary' : 'accent'"
          type="button"
        >
          {{ genre.name }}
        </button>
      }
    </div>

    <!-- search anime -->
    <mat-form-field>
      <mat-label>search anime</mat-label>
      <input matInput [formControl]="searchControl" [matAutocomplete]="auto" />
      <mat-hint>At least 3 characters</mat-hint>

      <!-- display options -->
      <mat-autocomplete #auto="matAutocomplete" [displayWith]="animeDisplayWith">
        @for (option of searchedData(); track option.mal_id) {
          <mat-option [value]="option" (onSelectionChange)="onSelectionChange(option, $event)">
            [{{ option.source }}]: {{ option.title_english ?? option.title }} ({{ option.duration }})
          </mat-option>
        }

        <!-- todo - add loading spinner -->
      </mat-autocomplete>
    </mat-form-field>
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
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
  ],
})
export class AnimeSearchComponent {
  private readonly apiService = inject(AnimeApiService);

  readonly selectedAnime = output<AnimeData>();

  readonly searchControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  readonly selectedGenresId = signal<number>(1);

  readonly animeGenres = toSignal(this.apiService.getAnimeGenres());

  // todo - change to rxResource once we have genres
  readonly searchedData = toSignal(
    this.searchControl.valueChanges.pipe(
      filter((x) => x.length > 3),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap((name) => this.apiService.searchAnime(name)),
    ),
  );

  animeDisplayWith(animeData: AnimeData): string {
    return animeData.title_english ?? animeData.title;
  }

  onGenresClick(genres: AnimeGenres): void {
    this.selectedGenresId.set(genres.mal_id);
  }

  /**
   * notify parent component that a value has been selected
   */
  onSelectionChange(animeData: AnimeData, event: any): void {
    // ignore on deselection of the previous option
    if (event.isUserInput) {
      this.selectedAnime.emit(animeData);
    }
  }
}
