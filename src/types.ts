export interface Anime {
  mal_id: number;
  title: string;
  episodes: number;
  images: {
    webp: {
      image_url: string;
      small_image_url: string;
    };
  };
}

export interface ScheduledEpisode {
  animeId: number;
  title: string;
  episodes: number[];
  image: string;
}

export interface DaySchedule {
  date: Date;
  schedules: ScheduledEpisode[];
}