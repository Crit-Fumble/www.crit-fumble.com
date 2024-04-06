// src/form-component/FormInputText.tsx
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";

type FormInputProps = {
  name: string;
  control: any;
  label: string;
};

export const FormSelect = ({ name, control, label }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <Select
          value={value}
          onChange={onChange}
          label={label}
          variant="outlined"
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
        </Select>
        // <TextField
        //   helperText={error ? error.message : null}
        //   size="small"
        //   error={!!error}
        //   onChange={onChange}
        //   value={value}
        //   fullWidth
        //   label={label}
        //   variant="outlined"
        // />
      )}
    />
  );
};