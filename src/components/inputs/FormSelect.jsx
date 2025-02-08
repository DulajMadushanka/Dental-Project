import { isEmpty } from "lodash";

const FormSelect = ({
  id,
  error,
  label,
  options,
  touched,
  onChange,
  selectedItem,
}: {
  id: string;
  label: string;
  error?: string;
  touched?: boolean;
  options?: Array<any>;
  selectedItem?: string;
  onChange?: (text: any) => void;
}) => {

  return (
    <div className="w-full">
      <label htmlFor={id} className=" mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={id}
        autoComplete={id}
        onChange={onChange}
        className="block p-2.5 w-full rounded-md outline-none border-gray-300 border shadow sm:text-sm"
      >
        <option
          disabled
          selected
          value=""
          className="text-xs font-medium text-gray-700"
        >
          Select your option
        </option>
        {options?.map((item: any) => {
          return <option selected={item.id === selectedItem} value={item.id}>{item.name}</option>;
        })}
      </select>
      {!isEmpty(error) && touched && (
        <span className="block text-xs font-normal text-rose-400">{error}</span>
      )}
    </div>
  );
};

export default FormSelect;
