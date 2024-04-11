import { FC } from 'react';
import useTagsStore from '../../store';
import { firstSpecialCharReg } from '../../utils';
import uuid from 'react-uuid';

const AutocompleteList: FC = () => {
  const {searchString, addTag, setStringValue, setSpecialCharacter, setSuggestions, suggestions, specialCharacter} = useTagsStore();
  if (!searchString) {
    return;
  }
  // const firstSpecialChar = searchString.test(firstSpecialCharReg);

  const handleItemClick = (e: any) => {
    setStringValue('');
    setSuggestions([]);

    addTag({text: e.target.children[0].innerText, special: specialCharacter && specialCharacter});
    setSpecialCharacter(null);
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
