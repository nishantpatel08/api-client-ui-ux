import { memo } from 'react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { HeaderActions } from './HeaderActions';
import './Header.css';

function HeaderComponent() {
  return (
    <header className="header" role="banner">
      <div className="header__left">
        <Logo />
      </div>
      <div className="header__center">
        <SearchBar />
      </div>
      <div className="header__right">
        <HeaderActions />
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);
