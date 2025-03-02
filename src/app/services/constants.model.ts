export const ANIME_API = {
  genres: {
    method: 'GET',
    url: 'https://api.jikan.moe/v4/genres/anime',
  },
  animeById: (id: number | string) => ({
    method: 'GET',
    url: `https://api.jikan.moe/v4/anime/${id}`,
  }),
  search: (prefix: string, genresId = 1) => ({
    method: 'GET',
    url: `https://api.jikan.moe/v4?q=${prefix}&genres=${genresId}&limit=6`,
  }),
} as const;
