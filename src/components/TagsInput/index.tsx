import { ChangeEvent, FC, KeyboardEvent, useState } from 'react';
import useTagsStore, { TSuggestion, TTag } from '@/store';
import { extractSpecialCharacters } from '@/utils';
import cx from 'classnames';

type TTagsInputProps = {
  data: TSuggestion[];
};

const TagsInput: FC<TTagsInputProps> = ({data}) => {
  const [suggestTags, setSuggestTags] = useState<TTag[]>([]);
  const {
    tagsList,
    addTag,
    setStringValue,
    setSpecialCharacter,
    searchString,
    suggestions,
    editFinalTag,
    setSuggestions,
    deleteTag,
  } = useTagsStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    const firstChar = value[0] || '';

    const specialChars = extractSpecialCharacters(value);

    if (!suggestions.length && firstChar && !/[a-zA-Z]/.test(firstChar)) {
      setSpecialCharacter(specialChars);
    }

    setStringValue(value);

    setSuggestions(
      value
        ? data.filter(
          (item) =>
            item.name.toLowerCase().includes(value.toLowerCase()) &&
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
        const firstLetterIndex = searchString.search(/[a-zA-Zа-яА-ЯЁё]/);

        if (firstLetterIndex > -1) {
          specialChars = searchString.slice(0, firstLetterIndex);
          textToAdd = searchString.slice(firstLetterIndex);
        } else {
          specialChars = searchString;
          textToAdd = '';
        }
      }

      if (textToAdd) {
        addTag({text: textToAdd, special: specialChars});
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

    if(e.key === 'ArrowDown') {
      const target = e.target as HTMLElement;
      console.log(target.parentElement?.previousElementSibling?.childNodes[0]);
      const listIem = target.parentElement?.previousElementSibling?.childNodes[0] as HTMLElement;
      if (listIem) listIem.focus();
    }
  };

  const handleTagDelete = (text: string) => () => {
    setTimeout(() => {setSuggestTags([])}, 0);
    deleteTag(text);
  };

  const handleTagClick = (tagValue: string | number | undefined, special: string, text: string) => () => {
    const strTagValue = tagValue?.toString().toLowerCase();

    if (!strTagValue) return;

    const matchingTags = data.filter(item => item.value?.toString().toLowerCase() === strTagValue);

    if (matchingTags.length === 0) return;

    const transformedTags: TTag[] = matchingTags.map(item => ({
      text: item.name,
      special,
      tagValue: item.value
    }));

    const filteredTags = transformedTags.filter(tag => tag.text !== text);

    setSuggestTags(filteredTags);
  };

  const handleSuggestTagClick = (tagValue: string | number | undefined, text: string, special: string) => () => {
      editFinalTag({text, special, tagValue});
      setSuggestTags([]);
    };

  return (
    <div className={cx('tags-input-container', {'open': suggestions.length > 0})}>
      {tagsList.map(({ text, special, tagValue }) => {
        const isLastTag = text === tagsList[tagsList.length - 1]?.text;

        return (
          <div key={text} className={cx('tag-wrapper', { 'final': isLastTag })}>
            {special && <span contentEditable className="tag-item-special">{special}</span>}

            <div className="tag-item" onClick={handleTagClick(tagValue, special, text)}>
              <span className="text">{text}</span>
              {isLastTag && <span className="close" onClick={handleTagDelete(text)}>&times;</span>}
            </div>

            {isLastTag && (
              <div className="suggest-tags">
                {suggestTags.map(({ tagValue, text, special }) => (
                  <div key={tagValue} className="tag-item" onClick={handleSuggestTagClick(tagValue, text, special)}>
                    <span className="text">{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
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
