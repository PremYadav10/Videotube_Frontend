import React, { useId, useState } from 'react';

const Input = React.forwardRef(function Input({
  label,
  type = "text",
  className = "",
  ...props
}, ref) {

  const id = useId();
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (type === "file" && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
    // call react-hook-form onChange if it exists
    props.onChange?.(e);
  };

  return (
    <div className='w-full mb-4'>
      {label && (
        <label className='inline-block p-2 text-xl' htmlFor={id}>
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          className={`px-3 py-2 rounded-lg text-white bg-gray-800 outline-none border border-gray-200 w-full  ${className}`}
          ref={ref}
          {...props}
          id={id}
        />
      ) : (
        <input
          type={type}
          className={`px-3 py-2 rounded-lg text-white bg-gray-800 outline-none border border-gray-200 w-full ${className}`}
          ref={ref}
          {...props}
          id={id}
          onChange={handleFileChange}
        />
      )}
      {type === "file" && fileName && (
        <p className="text-gray-400 mt-1 text-sm">{fileName}</p>
      )}
    </div>
  );
});

export default Input;
