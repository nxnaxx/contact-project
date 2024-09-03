import { useState } from 'react';
import styled from '@emotion/styled';
import { useFormContext } from '../contexts/FormContext';

const InputFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputLabel = styled.label`
  min-width: 96px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--gray-500);
  border-radius: 4px;

  &::placeholder {
    color: var(--gray-500);
  }
`;

const ErrorMessage = styled.p`
  color: var(--red);
  font-size: var(--fs-s);
  text-align: right;
`;

export default function InputField({
  fieldKey,
  label,
  regexPattern,
  errormessage,
}) {
  const { data, setData } = useFormContext();
  const [isValid, setIsValid] = useState(false);

  const validateValue = (value) => {
    const storedContacts =
      JSON.parse(localStorage.getItem('contactList')) || [];

    if (
      fieldKey === 'name' &&
      storedContacts.find(
        (contact) => contact.name === value.replace(/[^가-힣]/g, ''),
      )
    ) {
      return /^[가-힣]{2}[a-zA-Z0-9\s]*$/.test(value);
    }

    return regexPattern ? !regexPattern.test(value) : false;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    const updatedIsValid = validateValue(newValue);

    setData((datas) => ({
      ...datas,
      [fieldKey]: { value: newValue, isValid: updatedIsValid },
    }));
    setIsValid(updatedIsValid);
  };

  return (
    <InputFieldContainer>
      <InputWrapper>
        <InputLabel>{label}</InputLabel>
        <Input
          type="text"
          value={data[fieldKey].value}
          placeholder={label}
          onChange={handleChange}
        />
      </InputWrapper>
      {isValid && errormessage && <ErrorMessage>{errormessage}</ErrorMessage>}
    </InputFieldContainer>
  );
}
