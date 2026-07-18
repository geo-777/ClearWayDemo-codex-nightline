function RunDemoButton({ isRunning, onToggle }) {
  return (
    <button
      className={`run-demo-button ${isRunning ? 'is-running' : ''}`}
      type="button"
      onClick={onToggle}
    >
      <span className="button-symbol" aria-hidden="true">{isRunning ? '■' : '▶'}</span>
      {isRunning ? 'Stop Demo' : 'Run Demo'}
    </button>
  );
}

export default RunDemoButton;
