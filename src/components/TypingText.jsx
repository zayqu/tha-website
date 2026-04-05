import { useState, useEffect } from 'react';

export const TypingText = ({ text, speed = 100, loop = true }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const handleType = () => {
      const fullText = text;

      if (!isDeleting && displayText === fullText) {
        if (!loop) return;
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }

      if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        return;
      }

      const updateText = isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1);

      setDisplayText(updateText);
    };

    const timer = setTimeout(handleType, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, speed, loop, loopNum]);

  // Split into words
  const words = displayText.split(' ');

  return (
    <span>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            color: i === words.length - 1 ? '#ff9c1a' : 'inherit'
          }}
        >
          {word}
          {i !== words.length - 1 && ' '}
        </span>
      ))}
      <span className="animate-pulse">|</span>
    </span>
  );
};