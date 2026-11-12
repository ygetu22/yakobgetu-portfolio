type SaveButtonProps = {
  place: string;
  isSaved: boolean;
  onToggle: () => void;
};

// Heart toggle used on each print and in the photo view.
export default function SaveButton({ place, isSaved, onToggle }: SaveButtonProps) {
  return (
    <button
      type="button"
      className="journal-save"
      aria-pressed={isSaved}
      aria-label={`Save the ${place} photo`}
      onClick={onToggle}
    >
      {isSaved ? "♥" : "♡"}
    </button>
  );
}
