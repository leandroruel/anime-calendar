import React from 'react';
import { useCalendarStore } from '../store';
import type { Anime } from '../types';
import clsx from 'clsx';

interface EpisodeSelectorProps {
  anime: Anime;
  onSave: (episodes: number[]) => void;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  anime,
  onSave,
}) => {
  const [selectedEpisodes, setSelectedEpisodes] = React.useState<number[]>([]);
  const getExistingEpisodes = useCalendarStore((state) => state.getExistingEpisodes);
  const existingEpisodes = React.useMemo(
    () => getExistingEpisodes(anime.mal_id),
    [anime.mal_id, getExistingEpisodes]
  );

  const handleEpisodeChange = (episode: number) => {
    if (existingEpisodes.includes(episode)) return;
    
    setSelectedEpisodes((prev) =>
      prev.includes(episode)
        ? prev.filter((ep) => ep !== episode)
        : [...prev, episode].sort((a, b) => a - b)
    );
  };

  const renderEpisodeButton = (episode: number) => {
    const isExisting = existingEpisodes.includes(episode);
    const isSelected = selectedEpisodes.includes(episode);

    return (
      <button
        key={episode}
        onClick={() => handleEpisodeChange(episode)}
        disabled={isExisting}
        className={clsx(
          'p-2 text-sm rounded transition-colors',
          isExisting && 'bg-gray-300 text-gray-600 cursor-not-allowed relative group',
          isSelected && 'bg-blue-500 text-white',
          !isExisting && !isSelected && 'bg-gray-100 hover:bg-gray-200'
        )}
      >
        {episode}
        {isExisting && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-gray-800 bg-opacity-90 rounded transition-opacity">
            <span className="text-xs text-white">Already scheduled</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Select Episodes</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            Scheduled
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            Selected
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {Array.from({ length: anime.episodes }, (_, i) => i + 1).map(renderEpisodeButton)}
      </div>
      <button
        onClick={() => onSave(selectedEpisodes)}
        disabled={selectedEpisodes.length === 0}
        className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Episodes
      </button>
    </div>
  );
};