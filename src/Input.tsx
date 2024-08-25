
export const Input = ({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (e:string) => void;
}) => {

  return (
    <div className="mb-1">
      <label className="form-label">{label}</label>
      <input
        className="form-control form-control-sm"
        id="constants"
        type={type}
        value={value}
        // @ts-ignore its ok
        onChange={(e) => onChange(e?.target?.value ?? "")}
      />
    </div>
  );
};
