import ValidMarker from "./ValidMarker";

const TextField = ({
  field,
  placeholder,
  validation,
  isValid,
  label,
  required,
  onChange,
  value,
}) => {
  return (
    <label
      htmlFor={field}
      data-label={label}
      className={`${required ? "required" : ""}`}
    >
      <span>
        {label}
        {validation && <ValidMarker {...isValid} />}
      </span>
      <input
        name={field}
        type="text"
        placeholder={validation ? placeholder : ""}
        autoComplete={!validation ? "off" : "on"}
        {...{ value }}
        {...{ onChange }}
      />
    </label>
  );
};

export default TextField;
