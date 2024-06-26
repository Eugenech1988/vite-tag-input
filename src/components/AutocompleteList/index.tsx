import { FC } from 'react';
import useTagsStore from '../../store';
import uuid from 'react-uuid';

const AutocompleteList: FC = () => {
  const {searchString, addTag, setStringValue, setSpecialCharacter, setSuggestions, suggestions, specialCharacter} = useTagsStore();
  if (!searchString) {
    return;
  }

  const handleItemClick = (e: any) => {
    addTag({text: e.target.children[0].innerText, special: specialCharacter && specialCharacter});
    setStringValue('');
    setSuggestions([]);
    setSpecialCharacter('');
  };
  return (
    <>
      {suggestions.length > 0 &&
        <ul className="autocomplete-list">
          {suggestions.map(item =>
            <li className="autocomplete-list-item" onClick={handleItemClick} key={uuid()}>
              <span className='autocomplete-list-item-name'>{item.name}</span>
              <span className='autocomplete-list-item-category'>{item.category}</span>
            </li>
          )}
        </ul>
      }
    </>
  );
};

export default AutocompleteList;
