import { ChangeEvent, FC } from 'react';
import useTagsStore from '../../store';
import { firstSpecialCharReg } from '../../utils';
import cx from 'classnames';
import uuid from 'react-uuid';

type TTagsInputProps = {
  data: any[]
}

const TagsInput: FC<TTagsInputProps> = ({data}) => {
  const {tagsList, addTag, setStringValue, setSpecialCharacter, searchString, suggestions, setSuggestions, deleteTag} = useTagsStore();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextSubstring = e.target.value.substring(1);
    const firstSpecialChar = firstSpecialCharReg.test(e.target.value[0]);
    if (firstSpecialChar) {
      setSpecialCharacter(e.target.value[0])
    }
    setStringValue(e.target.value);
    if (e.target.value) {
      setSuggestions(
        data
          .filter((item: any) => (item.name.toLowerCase().includes((firstSpecialChar && nextSubstring !== '') ? nextSubstring : e.target.value)))
          .filter((item: any) => !tagsList.includes(item.name))
      );
    } else if (!e.target.value) {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      if (tagsList.find(tag => tag === e.target.value) || e.target.value === '') {
        return;
      }
      addTag({text: e.target.value, special: null});
      setStringValue('');
      setSuggestions([]);
    }
  };

  const handleTagDelete = (e: any) => {
    const tagToDelete = e.target.previousSibling.innerHTML;
    if (tagToDelete) {
      deleteTag(tagToDelete);
    }
  };

  return (
    <div className={cx('tags-input-container', {'open': (suggestions.length > 0)})}>
      {(tagsList.length > 0) &&
        tagsList.map(tag => (
          <div contentEditable key={uuid()}>
            {tag.special}
            <div contentEditable={false} className="tag-item">
              <span className="text">{tag.text}</span>
              <span className="close" onClick={handleTagDelete}>&times;</span>
            </div>
          </div>
        ))}
      <input
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        type="text"
        value={searchString}
        className="tags-input"
        placeholder="Type something"
      />
    </div>
  );
};

export default TagsInput;
