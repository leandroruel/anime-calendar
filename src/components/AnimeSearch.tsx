import React from 'react';
import { Search } from 'lucide-react';
import type { Anime } from '../types';

interface AnimeSearchProps {
  onSelect: (anime: Anime) => void;
}

export const AnimeSearch: React.FC<AnimeSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Anime[]>([]);
  const [loading, setLoading] = React.useState(false);

  const searchAnime = React.useCallback(async (search: string) => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(search)}&limit=5`
      );
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      searchAnime(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchAnime]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an anime..."
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      {loading && (
        <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg p-4">
          Loading...
        </div>
      )}
      {results.length > 0 && (
        <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg">
          {results.map((anime) => (
            <div
              key={anime.mal_id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onSelect(anime);
                setQuery('');
                setResults([]);
              }}
            >
              <img
                src={anime.images.webp.small_image_url}
                alt={anime.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-medium">{anime.title}</h4>
                <p className="text-sm text-gray-600">
                  {anime.episodes} episodes
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};