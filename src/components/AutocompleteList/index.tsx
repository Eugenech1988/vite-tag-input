import { FC, useId } from 'react';
import useTagsStore from '@/store';
import { extractSpecialCharacters } from '@/utils';

const AutocompleteList: FC = () => {
  const listId = useId();
  const {
    searchString,
    addTag,
    setStringValue,
    setSpecialCharacter,
    setSuggestions,
    suggestions,
    tagsList
  } = useTagsStore();

  if (!searchString) {
    return null;
  }

  const handleItemClick = (text: string, tagValue: string | number) => () => {
    const specialChars = extractSpecialCharacters(searchString);
    addTag({ text, special: specialChars, tagValue });
    console.log(tagsList);

    setStringValue('');
    setSuggestions([]);
    setSpecialCharacter(specialChars);
  };

  return (
    <>
      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((item) => (
            <li className="autocomplete-list-item" key={listId} onClick={handleItemClick(item.name, item.value)}>
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
