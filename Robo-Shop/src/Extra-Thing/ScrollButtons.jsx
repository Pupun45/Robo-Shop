import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa'; 

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    isVisible && (
      <div onClick={scrollToTop} style={styles.button}>
        <FaArrowUp />
      </div>
    )
  );
};

const styles = {
  button: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: 'rgb(206, 146, 33)',
    color: '#fff',
    padding: '10px 12px',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 1000,
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    fontSize: '20px',
  },
};

export default ScrollToTop;