import styled from "styled-components";

const LinkButton = styled.a`
font-size: 0.75rem;
padding-left: 0;
margin-top: 0;
padding-top: 0;
`

export const Input = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  min = 1,
  max = 10,
  randomize,
}: {
  label: string;
  value: string;
  type?: string;
  min?: number;
  max?: number;
  onChange: (e: string) => void;
  disabled?: boolean;
  randomize?: () => void;
}) => {
  return (
    <div className="mb-1">
      {randomize ? (
        <LinkButton  className="btn btn-link" onClick={randomize}>
          {label}
        </LinkButton>
      ) : (
        <label className="form-label">{label}</label>
      )}

      <input
        disabled={disabled}
        className="form-control form-control-sm"
        id="constants"
        type={type}
        min={min}
        max={max}
        value={value}
        style={{ fontSize: "0.75rem" }}
        // @ts-ignore its ok
        onChange={(e) => onChange(e?.target?.value ?? "")}
      />
    </div>
  );
};
