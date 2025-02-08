import { isEmpty } from "lodash";
import { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const FormInput = ({
  id,
  label,
  error,
  value,
  touched,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  id: string;
  value?: string;
  type?: string;
  label?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange: (text: string) => void;
}) => {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="w-full relative flex flex-row">
        <input
          id={id}
          name={id}
          value={value}
          autoComplete={id}
          disabled={disabled}
          placeholder={placeholder}
          type={isVisiblePassword ? "text" : type}
          onChange={(e) => onChange(e.target.value)}
          className="p-2.5 h-10 block w-full rounded-md outline-none border-gray-300 border shadow sm:text-sm"
        />
        {type === "password" ? (
          <>
            {isVisiblePassword ? (
              <AiOutlineEye
                onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                className="absolute right-4 top-3"
              />
            ) : (
              <AiOutlineEyeInvisible
                onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                className="absolute right-4 top-3"
              />
            )}
          </>
        ) : null}
      </div>
      {!isEmpty(error) && touched && (
        <span className="mt-1 first-line:block text-xs font-normal text-rose-400	">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
