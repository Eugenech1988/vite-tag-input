import { FC } from 'react';
import TagsInput from './components/TagsInput';
import AutocompleteList from './components/AutocompleteList';
import useTagsStore from './store';
import { useQuery } from '@tanstack/react-query';
import { fetchAutocomplete } from './api';

const App: FC = () => {
  const {tagsList} = useTagsStore();
  const {isPending, isError, data, error} = useQuery({
    queryKey: ['todos'],
    queryFn: fetchAutocomplete
  });
  if (isPending) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <>
      <span>{`Tags count: ${tagsList.length}`}</span>
      <div className="autocomplete-wrapper">
        <AutocompleteList/>
        <TagsInput data={data}/>
      </div>
    </>
  );
};

export default App;
