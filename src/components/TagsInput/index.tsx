import { ChangeEvent, FC, KeyboardEvent } from 'react';
import useTagsStore, { TSuggestion } from '../../store';
import { firstSpecialCharReg } from '../../utils';
import cx from 'classnames';

type TTagsInputProps = {
  data: TSuggestion[]
}

const TagsInput: FC<TTagsInputProps> = ({data}) => {
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
    const {value} = e.target;
    const firstChar = value[0] || '';
    const firstSpecialChar = firstSpecialCharReg.test(firstChar);
    const searchText = firstSpecialChar ? value.slice(1) : value;

    if (firstSpecialChar) setSpecialCharacter(firstChar);
    setStringValue(value);

    setSuggestions(
      value
        ? data.filter(
          (item): item is TSuggestion =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) &&
            !tagsList.some((tag) => tag.text === item.name)
        )
        : []
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchString.trim() !== '' && !tagsList.some(tag => tag.text === searchString)) {
      addTag({text: searchString, special: ''});
      setStringValue('');
      setSuggestions([]);
    }

    if (e.key === 'Backspace' && searchString === '' && tagsList.length) {
      deleteTag(tagsList[tagsList.length - 1].text);
    }
  };

  const handleTagDelete = (text: string) => () => {
    deleteTag(text);
  };

  return (
    <div className={cx('tags-input-container', {'open': (suggestions.length > 0)})}>
      {tagsList.map(({text, special}) => (
        <div contentEditable key={text} className="tag-wrapper">
          {special}
          <div contentEditable className="tag-item">
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
