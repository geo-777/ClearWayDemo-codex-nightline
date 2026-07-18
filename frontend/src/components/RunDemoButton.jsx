import { useEffect, useRef, useState } from 'react';

function RunDemoButton({ onRunDemo }) {
  const [isStarting, setIsStarting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleClick() {
    onRunDemo?.();
    setIsStarting(true);
    timeoutRef.current = setTimeout(() => setIsStarting(false), 1500);
  }

  return (
    <button
      className="run-demo-button"
      type="button"
      disabled={isStarting}
      onClick={handleClick}
    >
      {isStarting ? 'Demo Running...' : '▶ Run Demo'}
    </button>
  );
}

export default RunDemoButton;
