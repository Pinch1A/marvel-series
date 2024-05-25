import { useEffect, useState } from 'react';
import { Character, CharacterLink, Series } from '@/types';
import CharacterGraph from './CharacterGraph';
import CharacterDetails from './CharacterDetails';
import { fetchCharactersBySeries } from '@/api/series';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import Loading from './Loading';

interface Props {
  serie: Series;
}

const SerieWrapper = ({ serie }: Props) => {

  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [links, setLinks] = useState<CharacterLink[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchAndSetCharacters();
  }, [serie]);

  const fetchAndSetCharacters = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCharactersBySeries(serie.id);
      const charactersData = response.results.map((character: Character, index: number) => ({
        ...character,
        id: character.id.toString(),
      }));

      setAllCharacters(charactersData);

      const linksData: CharacterLink[] = generateLinks(charactersData);
      setLinks(linksData);
      setError(null);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unexpected error occurred');
      }
      console.error('Error fetching characters:', error);
    }
  };

  const generateLinks = (characters: Character[]): CharacterLink[] => {
    const links: CharacterLink[] = [];
    const seriesMap: { [key: string]: string[] } = {};
    const storyMap: { [key: string]: string[] } = {};

    // Map characters to the series they appear in
    characters.forEach((character) => {
      character.series?.items.forEach((serie) => {
        if (!seriesMap[serie.name]) {
          seriesMap[serie.name] = [];
        }
        seriesMap[serie.name].push(character.id.toString());
      });

      // Map characters to the stories they appear in
      character.stories?.items.forEach((story) => {
        if (!storyMap[story.name]) {
          storyMap[story.name] = [];
        }
        storyMap[story.name].push(character.id.toString());
      });
    });

    // Create links based on co-appearances in the same series
    Object.entries(seriesMap).forEach(([name, ids]) => {
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          if (ids[i] !== ids[j]) {
            links.push({ source: ids[i], target: ids[j], type: 'series', id: name });
          }
        }
      }
    });

    // Create links based on co-appearances in the same stories
    Object.entries(storyMap).forEach(([name, ids]) => {
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          if (ids[i] !== ids[j]) {
            links.push({ source: ids[i], target: ids[j], type: 'story', id: name });
          }
        }
      }
    });

    return links;
  };

  const handleNodeClick = (node: Character | null) => {
    setSelectedCharacter(node);
    setIsOpen(!isOpen);
  };

  const handleOpenDialog = () => {
    setIsOpen(!isOpen);
  }

  return (
    <Card className='p-4'>
      <h1>{serie.title}</h1>
      {isLoading && !error && <Loading />}
      {!isLoading && (error ? <div className="text-red-500">{error}</div>
        : (
          <div className="flex flex-col w-full ">
            <CharacterGraph
              nodes={allCharacters}
              links={links}
              onClickNode={handleNodeClick}
            />
            {selectedCharacter && (
              <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
                <CharacterDetails character={selectedCharacter} close={handleNodeClick} />
              </Dialog>
            )}
          </div>

        )
      )
      }
    </Card >
  );
}

export default SerieWrapper;
