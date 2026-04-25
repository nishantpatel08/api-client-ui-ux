import { memo } from 'react';
import { Zap } from 'lucide-react';

function LogoComponent() {
  return (
    <div className="header__logo" aria-label="Rest Fox">
      <span className="header__logo-mark" aria-hidden="true">
        <Zap className="header__logo-icon" />
      </span>
      <span className="header__logo-text">Rest Fox</span>
    </div>
  );
}

export const Logo = memo(LogoComponent);
