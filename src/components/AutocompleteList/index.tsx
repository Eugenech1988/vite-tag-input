import { FC } from 'react';
import useTagsStore from '@/store';
import { extractSpecialCharacters } from '@/utils';

const AutocompleteList: FC = () => {
  const {
    searchString,
    addTag,
    setStringValue,
    setSpecialCharacter,
    setSuggestions,
    suggestions,
  } = useTagsStore();

  if (!searchString) {
    return null;
  }

  const handleItemClick = (text: string) => () => {
    const specialChars = extractSpecialCharacters(searchString);
    addTag({ text, special: specialChars });

    setStringValue('');
    setSuggestions([]);
    setSpecialCharacter(specialChars);
  };

  return (
    <>
      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((item) => (
            <li className="autocomplete-list-item" onClick={handleItemClick(item.name)}>
              <span className="autocomplete-list-item-name">{item.name}</span>
              <span className="autocomplete-list-item-value">{item.value}</span>
              <span className="autocomplete-list-item-category">{item.category}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default AutocompleteList;
