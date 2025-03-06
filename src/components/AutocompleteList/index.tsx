import { FC, useId, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
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
    setSuggestedTags,
    suggestions,
    tagsList
  } = useTagsStore();

  if (!searchString) {
    return null;
  }

  const handleItemClick = (text: string, tagValue: string | number) => () => {
    const specialChars = extractSpecialCharacters(searchString);
    addTag({ text, special: specialChars, tagValue });

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
      setSuggestedTags([]);
      const target = e.target as HTMLInputElement;
      target.click();
      const input = target.parentElement?.nextElementSibling?.childNodes[tagsList.length] as HTMLInputElement;
      if (input) input.focus();
    }

    if (e.key === 'Escape') {
      const target = e.target as HTMLInputElement;
      const input = target.parentElement?.nextElementSibling?.childNodes[tagsList.length] as HTMLInputElement;
      if (input) input.focus();
    }
  };

  return (
    <>
      {suggestions.length > 0 && (
        <motion.ul className="autocomplete-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          aria-expanded={suggestions.length > 0}
          exit={{ opacity: 0 }}
        >
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
        </motion.ul>
      )}
    </>
  );
};

export default AutocompleteList;
