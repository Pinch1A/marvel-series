import React, { useState } from 'react';
import SerieWrapper from './SerieWrapper';
import { Series } from '@/types';
import { fetchSeries } from '@/api/series';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Loading from './Loading';

const CharacterExplorePage: React.FC = () => {
  const [inputSeries, setInput] = useState<string>('');
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetSeries = async () => {
    try {
      setIsLoading(true);
      const response = await fetchSeries({ titleStartsWith: inputSeries });
      console.log('response', response);
      const seriesWithAvailableCharacters = response.results.filter((item: Series) => item.characters.available > 0);
      setAllSeries(seriesWithAvailableCharacters);
      setError(null); // Clear any previous errors
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unexpected error occurred');
      }
      console.error('Error fetching series:', error);
    }
  };
  const handleSearch = () => {
    fetchAndSetSeries();
  };

  return (
    <div className="container mx-auto p-4 w-full min-h-screen">
      <div className="flex justify-start items-center  w-full p-4 space-x-3 ">
        <Label className="flex text-3xl">
          Search a Marvel Series:
        </Label>
        <Input
          type="text"
          value={inputSeries}
          onChange={(e) => setInput(e.target.value)}
          className="flex w-1/3 text-lg"
        />
        <Button onClick={handleSearch} variant="secondary" disabled={isLoading}>
          Search
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {isLoading && !error ? <Loading /> :
        allSeries.map((item: Series) => (
          <div key={item.id} className="">
            <SerieWrapper serie={item} />
          </div>
        )
        )}
    </div>
  );
};

export default CharacterExplorePage;
