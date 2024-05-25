import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Character {
  id: number;
  name: string;
  thumbnail: {
    path: string;
    extension: string;
  };
}

const CharacterList = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [series, setSeries] = useState<string>('');
  const [story, setStory] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchCharacters();
  }, [series, story, page]);

  const fetchCharacters = async () => {
    const response = await axios.get('http://localhost:5000/characters', {
      params: { series, story, page },
    });
    setCharacters(response.data.results);
  };

  const handleSeriesChange = (e: React.ChangeEvent<HTMLInputElement>) => setSeries(e.target.value);
  const handleStoryChange = (e: React.ChangeEvent<HTMLInputElement>) => setStory(e.target.value);
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <label className="flex-1">
          Series:
          <input
            type="text"
            value={series}
            onChange={handleSeriesChange}
            className="border p-2 ml-2"
          />
        </label>
        <label className="flex-1">
          Story:
          <input
            type="text"
            value={story}
            onChange={handleStoryChange}
            className="border p-2 ml-2"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
          <div key={character.id} className="border p-4">
            <h2 className="text-xl mb-2">{character.name}</h2>
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CharacterList;
