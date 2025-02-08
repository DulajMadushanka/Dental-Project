import { FieldProps } from "formik";
import { isEmpty } from "lodash";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends FieldProps {
  id: string;
  options: any;
  type?: string;
  value?: string;
  error?: string;
  label?: string;
  isMulti?: boolean;
  touched?: boolean;
  className?: string;
  placeholder?: string;
  onChangeItem?: (option: any) => void;
}

export const CustomSelect = ({
  id,
  form,
  type,
  label,
  error,
  field,
  value,
  options,
  touched,
  placeholder,
  isMulti = false,
  onChangeItem,
}: CustomSelectProps) => {
  const onChange = (option: any) => {
    if (type === "UNIT" && onChangeItem) {
      onChangeItem(option);
    } else {
      form.setFieldValue(
        field.name,
        isMulti
          ? (option as Option[]).map((item: Option) => item.value)
          : (option as Option).value
      );
    }
  };

  const getValue = () => {
    if (options) {
      if(type === "UNIT"){
        return options.find((option: any) => option.value === value)
      }else{
        return isMulti
        ? options.filter(
            (option: any) => field.value.indexOf(option.value) >= 0
          )
        : options.find((option: any) => option.value === field.value);
      }

    } else {
      return isMulti ? [] : ("" as any);
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      boxShadow: "none",
      borderColor: "#D1D5DB",
      "&:hover": {
        borderColor: "#D1D5DB",
      },
    }),
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="w-full relative flex flex-row">
        <Select
          className={"block w-full rounded-md outline-none shadow text-sm"}
          styles={customStyles}
          name={field.name}
          value={getValue()}
          onChange={onChange}
          placeholder={placeholder}
          options={options}
          isMulti={isMulti}
        />
      </div>
      {!isEmpty(error) && touched && (
        <span className="mt-1 first-line:block text-xs font-normal text-rose-400	">
          {error}
        </span>
      )}
    </div>
  );
};

export default CustomSelect;
