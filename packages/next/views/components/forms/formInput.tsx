import { Controller } from "react-hook-form";

type FormInputProps = {
  name: string;
  control: any;
  label: string;
};

export const FormInput = ({ name, control, label, ...inputProps }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
      }) => (
        <>
          {label && (<label>{label}</label>)}
          <input
            name={name}
            onChange={onChange}
            value={value}
            {...inputProps}
          />
        </>
      )}
    />
  );
};