import { ChangeEvent, FC } from 'react';
import useTagsStore from '../../store';
import cx from 'classnames';
import uuid from 'react-uuid';

type TTagsInputProps = {
  data: object[]
}

const TagsInput: FC<TTagsInputProps> = ({data}) => {
  const {tagsList, addTag, setStringValue, searchString, suggestions, setSuggestions, deleteTag} = useTagsStore();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStringValue(e.target.value);
    if (e.target.value) {
      setSuggestions(
        data
          .filter(item => (item.name.toLowerCase().includes(e.target.value)))
          .filter(item => !tagsList.includes(item.name))
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
      addTag(e.target.value);
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
          <div contentEditable>
            <div contentEditable={false} className="tag-item" key={uuid()}>
              <span className="text">{tag}</span>
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
