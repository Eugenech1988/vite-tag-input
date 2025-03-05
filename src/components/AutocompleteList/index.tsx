import { FC, useId, KeyboardEvent } from 'react';
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

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement;

    const parentList = target.parentElement as HTMLElement;
    if (!parentList) return;

    const listItems = parentList.childNodes;

    const currentIndex = Array.from(listItems).indexOf(target);

    if (e.key === 'ArrowDown') {
      if (currentIndex < listItems.length - 1) {
        const nextItem = listItems[currentIndex + 1] as HTMLElement;
        nextItem.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      if (currentIndex > 0) {
        const prevItem = listItems[currentIndex - 1] as HTMLElement;
        prevItem.focus();
      }
    }

    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      target.click();
    }

    if (e.key === 'Escape') {
      const target = e.target as HTMLInputElement;
      const input = target.parentElement?.nextElementSibling?.childNodes[0] as HTMLInputElement;
      if (input) input.focus();
    }
  };

  return (
    <>
      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((item, index) => (
            <li
              onKeyDown={handleKeyDown}
              key={listId}
              tabIndex={index}
              className="autocomplete-list-item"
              onClick={handleItemClick(item.name, item.value)}
            >
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
