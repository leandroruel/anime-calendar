import React from 'react';
import { Calendar } from './components/Calendar';
import { AnimeSearch } from './components/AnimeSearch';
import { EpisodeSelector } from './components/EpisodeSelector';
import { AuthButton } from './components/AuthButton';
import { MonthPicker } from './components/MonthPicker';
import { useCalendarStore } from './store/calendar';
import { useAuthStore } from './store/auth';
import { Tv2, RotateCcw } from 'lucide-react';
import type { Anime } from './types';

function App() {
  const [selectedAnime, setSelectedAnime] = React.useState<Anime | null>(null);
  const { selectedDate, addSchedule, clearSchedule } = useCalendarStore();
  const { user } = useAuthStore();

  const handleSaveEpisodes = async (episodes: number[]) => {
    if (selectedAnime && selectedDate) {
      await addSchedule(selectedDate, {
        animeId: selectedAnime.mal_id,
        title: selectedAnime.title,
        episodes,
        image: selectedAnime.images.webp.small_image_url,
      });
      setSelectedAnime(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Tv2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">Anime Calendar</h1>
          </div>
          <AuthButton />
        </div>

        {user ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <MonthPicker />
              <button
                onClick={clearSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Calendar
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Calendar />
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Schedule Anime</h2>
                  {selectedDate ? (
                    <>
                      <AnimeSearch onSelect={setSelectedAnime} />
                      {selectedAnime && (
                        <EpisodeSelector
                          anime={selectedAnime}
                          onSave={handleSaveEpisodes}
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-gray-600">
                      Select a date on the calendar to schedule anime episodes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sign in to start planning your anime schedule
            </h2>
            <p className="text-gray-600 mb-8">
              Keep track of your favorite anime episodes across multiple months
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;