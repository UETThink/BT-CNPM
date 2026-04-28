const TMDB_API_KEY = process.env.TMDB_API_KEY || "e0e789c22a13c05ee9164dc37dfb48d9";
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMGU3ODljMjJhMTNjMDVlZTkxNjRkYzM3ZGZiNDhkOSIsIm5iZiI6MTc3NzM1NjM5Ny43MDgsInN1YiI6IjY5ZjA0ZTZkMmQwMmVjNjZlMWQ3N2U4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.81GKzLwt2L3s_MEY2YluX1Bo0-i5IzYpUHjoCrdxtgo";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface TMDBMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export async function searchMoviePoster(title: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=vi-VN`
    );

    if (!response.ok) {
      console.error("TMDB search failed:", response.status);
      return null;
    }

    const data = await response.json();

    console.log(`TMDB search for "${title}":`, data.results?.length || 0, "results");

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      console.log(`Found: "${movie.title}" (TMDB ID: ${movie.id})`);
      if (movie.poster_path) {
        const posterUrl = `${TMDB_IMAGE_BASE}/w500${movie.poster_path}`;
        console.log(`Poster URL: ${posterUrl}`);
        return posterUrl;
      }
    }

    console.log(`No poster found for "${title}"`);
    return null;
  } catch (error) {
    console.error("Error fetching TMDB poster:", error);
    return null;
  }
}

export function getTMDBImageUrl(path: string | null, size: "w185" | "w342" | "w500" | "original" = "w500"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
