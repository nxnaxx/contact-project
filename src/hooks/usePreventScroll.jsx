import { useCallback, useEffect, useRef, useState } from 'react';

const usePreventScroll = (initialState) => {
  const [isOpened, setIsOpened] = useState(initialState);
  const useOpenRef = useRef(null);

  const handleToggleOpen = useCallback(() => {
    setIsOpened((isOpened) => !isOpened);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (useOpenRef.current && !useOpenRef.current.contains(e.target))
        setIsOpened(false);
    };

    if (isOpened) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.addEventListener('mouseup', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [isOpened]);

  return { isOpened, setIsOpened, useOpenRef, handleToggleOpen };
};

export default usePreventScroll;
