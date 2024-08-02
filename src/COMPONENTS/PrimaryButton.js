export function PrimaryButton({ text, onPress, classes }) {
  return (
    <button className={`primary-button ${classes}`} onClick={onPress}>
      {text}
    </button>
  );
}
