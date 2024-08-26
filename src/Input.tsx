import styled from "styled-components";

const StyledInput = styled.input`
  font-size: 0.75rem;
`;

export const Input = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  min = 1,
  max = 10,
}: {
  label: string;
  value: string;
  type?: string;
  min?: number;
  max?: number;
  onChange: (e: string) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="mb-1">
      <label className="form-label">{label}</label>
      <StyledInput
        disabled={disabled}
        className="form-control form-control-sm"
        id="constants"
        type={type}
        min={min}
        max={max}
        value={value}
        // @ts-ignore its ok
        onChange={(e) => onChange(e?.target?.value ?? "")}
      />
    </div>
  );
};
