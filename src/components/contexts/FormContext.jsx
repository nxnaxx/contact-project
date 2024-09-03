import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormContextProvider = ({ children }) => {
  const initialData = {
    name: { value: '', isValid: true },
    phoneNumber: { value: '', isValid: true },
    group: { value: '', isValid: false },
    content: { value: '', isValid: false },
  };
  const [data, setData] = useState(initialData);

  return (
    <FormContext.Provider value={{ data, setData, initialData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      'useFormContext는 FormContextProvider 내부에서만 사용할 수 있습니다.',
    );
  }
  return context;
};
