export type AnimeDataImage = {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
};

export type AnimeData = {
  mal_id: number;
  url: string;
  images: {
    jpg: AnimeDataImage;
    webp: AnimeDataImage;
  };
  title: string;
  title_english?: string;
  episodes: number;
  score: number;
  duration: string;
  popularity: number;
  source: string;
  rank: number;
};

export type AnimeGenres = {
  mal_id: number;
  name: string;
  url: string;
  count: number;
};

export type AnimeDataAPI<T> = {
  data: T[];
};

export type AnimeDetails = {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
    images: {
      image_url: string;
      small_image_url: string;
      medium_image_url: string;
      large_image_url: string;
      maximum_image_url: string;
    };
  };
  approved: boolean;
  titles: {
    type: string;
    title: string;
  }[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: any[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    prop: {
      from: {
        day: number;
        month: number;
        year: number;
      };
      to: { day: number; month: number; year: number };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
  producers: { mal_id: number; type: string; name: string; url: string }[];
  licensors: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  studios: { mal_id: number; type: string; name: string; url: string }[];
  genres: { mal_id: number; type: string; name: string; url: string }[];
  explicit_genres: any[];
  themes: { mal_id: number; type: string; name: string; url: string }[];
  demographics: any[];
};

export const ANIME_API = {
  genres: {
    method: 'GET',
    url: 'https://api.jikan.moe/v4/genres/anime',
  },
  animeById: (id: number | string) => ({
    method: 'GET',
    url: `https://api.jikan.moe/v4/anime/${id}`,
  }),
  search: (prefix: string, genresId = '1') => ({
    method: 'GET',
    url: `https://api.jikan.moe/v4?q=${prefix}&genres=${genresId}&limit=6`,
  }),
} as const;
