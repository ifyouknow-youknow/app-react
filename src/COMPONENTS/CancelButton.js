export function CancelButton({text, classes, onPress}) {
    return(
        <button className={`cancel-button ${classes}`} onClick={onPress}>
            {text}
        </button>
    )
}