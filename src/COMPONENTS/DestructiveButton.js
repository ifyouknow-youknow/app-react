export function DestructiveButton({ text, onPress }) {
    return (
      <button className="destructive-button" onClick={onPress}>
        {text}
      </button>
    );
  }
  