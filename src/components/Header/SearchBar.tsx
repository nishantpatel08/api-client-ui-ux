import { memo, useCallback, useState, type ChangeEvent } from 'react';
import { Codicon } from '@/components/ui/codicon';
import { Input } from '@/components/ui/input';

function SearchBarComponent() {
  const [value, setValue] = useState('');

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  return (
    <div className="header__search" role="search">
      <Codicon name="search" className="header__search-icon" aria-hidden="true" />
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search requests, collections, environments..."
        className="header__search-input"
        aria-label="Search"
      />
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
