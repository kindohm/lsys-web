export const Checkbox = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value=""
        checked={checked}
        // @ts-ignore
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="form-check-label">{label}</label>
    </div>
  );
};
