// src/form-component/FormInputText.tsx
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

type FormInputProps = {
  name: string;
  control: any;
  label: string;
};

export const FormInput = ({ name, control, label }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <TextField
          name={name}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
        />
      )}
    />
  );
};