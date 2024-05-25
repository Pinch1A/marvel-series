import { Character } from '@/types';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  character: Character;
  close: (value: null) => void;
}

const CharacterDetails = ({ character, close }: Props) => {
  return (
    <DialogContent>
      <div className="flex flex-col p-4 ">
        <DialogHeader>
          <DialogTitle>{character.name}</DialogTitle>
        </DialogHeader>

        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
          className="w-16 h-16 shadow-md rounded-full"
        />
        <div className="flex flex-col mt-4 border-gray-200 rounded-md">
          <span className="text-lg">Series:</span>
          <ul className="list-disc list-inside">
            {character.series?.items.map((serie) => (
              <li key={serie.name}>{serie.name}</li>
            ))}
          </ul>
        </div>
      </div >
    </DialogContent>
  );
};

export default CharacterDetails;
