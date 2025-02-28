import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AnimeData, AnimeDataAPI, AnimeDetails, AnimeGenres } from './api.model';

@Injectable({
  providedIn: 'root',
})
export class AnimeApiService {
  // api docs: https://docs.api.jikan.moe
  private readonly API = 'https://api.jikan.moe/v4';
  private readonly http = inject(HttpClient);

  getAnimeById(id: number | string) {
    return this.http.get<{ data: AnimeDetails }>(`${this.API}/anime/${id}`).pipe(map((res) => res.data));
  }

  getAnimeGenres() {
    return this.http.get<AnimeDataAPI<AnimeGenres>>(`${this.API}/genres/anime`).pipe(map((res) => res.data));
  }

  /**
   * search anime based on prefix
   *
   * @param prefix prefix of the anime we are searching
   * @param genresId genres id of the anime
   * @returns searched anime that has 'score' property
   */
  searchAnime(prefix: string, genresId = '1') {
    return this.http
      .get<AnimeDataAPI<AnimeData>>(`${this.API}/anime?q=${prefix}&genres=${genresId}&limit=6`)
      .pipe(map((res) => res.data.filter((d) => !!d.score)));
  }
}
