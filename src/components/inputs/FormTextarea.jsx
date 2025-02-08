import { isEmpty } from "lodash";

const FormTextarea = ({
  id,
  label,
  error,
  value,
  touched,
  onChange,
}: {
  id: string;
  label: string;
  error?: string;
  value?: string;
  touched?: boolean;
  onChange: (text: string) => void;
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={label}
        className="block mb-2 text-sm font-medium text-gray-700 "
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        name={id}
        value={value}
        className="block p-2.5 w-full rounded-md outline-none border-gray-300 border shadow sm:text-sm"
        placeholder="Write your thoughts here..."
        onChange={(e) => onChange(e.target.value)}
      />
      {!isEmpty(error) && touched && (
        <span className="mt-1 block text-xs font-normal text-rose-500	">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormTextarea;
