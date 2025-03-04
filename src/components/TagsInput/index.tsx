import { ChangeEvent, FC, KeyboardEvent } from 'react';
import useTagsStore, { TSuggestion } from '@/store';
import { extractSpecialCharacters } from '@/utils';
import cx from 'classnames';

type TTagsInputProps = {
  data: TSuggestion[];
};

const TagsInput: FC<TTagsInputProps> = ({ data }) => {
  const {
    tagsList,
    addTag,
    setStringValue,
    setSpecialCharacter,
    searchString,
    suggestions,
    setSuggestions,
    deleteTag
  } = useTagsStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const firstChar = value[0] || '';
    const searchText = value;

    const specialChars = extractSpecialCharacters(value);

    if (!suggestions.length && firstChar && !/[a-zA-Z]/.test(firstChar)) {
      setSpecialCharacter(specialChars);
    }

    setStringValue(value);

    setSuggestions(
      value
        ? data.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) &&
            !tagsList.some((tag) => tag.text === item.name)
        )
        : []
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchString.trim() !== '' && !tagsList.some(tag => tag.text === searchString)) {
      const firstChar = searchString[0] || '';

      let textToAdd;
      let specialChars;

      if (/^[a-zA-Zа-яА-ЯЁё]/.test(firstChar)) {
        textToAdd = searchString;
        specialChars = '';
      } else {
        const firstLetterIndex = searchString.search(/[a-zA-Zа-яА-ЯЁё]/);  // Индекс первой буквы

        if (firstLetterIndex > -1) {
          specialChars = searchString.slice(0, firstLetterIndex);
          textToAdd = searchString.slice(firstLetterIndex);
        } else {
          specialChars = searchString;
          textToAdd = '';
        }
      }

      if (textToAdd) {
        addTag({ text: textToAdd, special: specialChars });
      }

      setStringValue('');
      setSuggestions([]);
      setSpecialCharacter('');
    }

    if (e.key === 'Backspace' && searchString === '' && tagsList.length) {
      const lastTag = tagsList[tagsList.length - 1];
      e.preventDefault();

      if (lastTag.special) {
          setStringValue(lastTag.special);
      } else {
        setStringValue('');
      }

      deleteTag(lastTag.text);
    }
  };

  const handleTagDelete = (text: string) => () => {
    deleteTag(text);
  };

  const handleTagClick = () => {
    console.log('tag clicked');
  };

  return (
    <div className={cx('tags-input-container', { 'open': suggestions.length > 0 })}>
      {tagsList.map(({ text, special }) => (
        <div contentEditable key={text} className="tag-wrapper">
          {special}
          <div contentEditable className="tag-item" onClick={handleTagClick}>
            <span className="text">{text}</span>
            <span className="close" onClick={handleTagDelete(text)}>&times;</span>
          </div>
        </div>
      ))}
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
        value={searchString}
        className="tags-input"
        placeholder="Type something"
      />
    </div>
  );
};

export default TagsInput;
