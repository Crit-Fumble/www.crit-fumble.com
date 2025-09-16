import { Controller } from "react-hook-form";

type FormInputProps = {
  name: string;
  control: any;
  label: string;
};

export const FormSelect = ({ name, control, label, ...inputProps }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { name, onChange, value },
        fieldState: { error },
        // formState,
      }) => (
        <>
          {label && (<label htmlFor={name}>{label}</label>)}
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            {...inputProps}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          {error?.message && <div>{error.message}</div>}
        </>
      )}
    />
  );
};