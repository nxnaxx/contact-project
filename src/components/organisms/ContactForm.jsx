import styled from '@emotion/styled';
import { useFormContext } from '../contexts/FormContext';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../molecules/InputField';
import GroupSelect from '../molecules/GroupSelect';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
  height: fit-content;
  padding: 24px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
`;

const SaveButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  background-color: var(--primary);
  color: var(--white);

  &:hover {
    background-color: var(--primary-dark);
  }
`;

const toastStyle = {
  position: 'top-left',
  autoClose: 2500,
  hideProgressBar: false,
  progress: undefined,
  theme: 'dark',
  transition: Bounce,
};

export default function ContactForm() {
  const { data, setData, initialData } = useFormContext();
  const nameNotify = () => toast.warn('동일한 이름이 존재합니다.', toastStyle);
  const phoneNotify = () =>
    toast.warn('동일한 전화번호가 존재합니다.', toastStyle);

  const saveData = () => {
    const storedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    const storedContacts =
      JSON.parse(localStorage.getItem('contactList')) || [];

    if (storedGroups.length === 0) return alert('그룹을 추가해주세요.');

    if (data.group.value === '') data.group.value = storedGroups[0];

    // 동명이인이 리스트에 존재할 경우, toast 표출
    if (storedContacts.find((contact) => contact.name === data.name.value)) {
      return nameNotify();
    }

    // 동일한 전화번호가 리스트에 존재할 경우, toast 표출
    if (
      storedContacts.find(
        (contact) => contact.phoneNumber === data.phoneNumber.value,
      )
    ) {
      return phoneNotify();
    }

    const allValid = Object.values(data).every((field) => !field.isValid);

    if (allValid) {
      const contactList = JSON.parse(localStorage.getItem('contactList')) || [];
      const newContact = Object.entries(data).reduce(
        (acc, [key, { value }]) => {
          acc[key] = value;
          return acc;
        },
        {},
      );
      contactList.push(newContact);
      localStorage.setItem('contactList', JSON.stringify(contactList));
      setData(initialData);
    } else alert('모든 항목을 올바르게 입력해주세요.');
  };

  return (
    <>
      <ToastContainer />
      <FormContainer>
        <InputField
          fieldKey="name"
          label="이름"
          regexPattern={/^[가-힣]{2,}$/}
          errormessage="이름은 한글로 두 글자 이상 입력해주세요."
        />
        <InputField
          fieldKey="phoneNumber"
          label="전화번호"
          regexPattern={/^010-\d{3,4}-\d{4}$/}
          errormessage="전화번호는 010-0000-0000 형식으로 입력해주세요."
        />
        <GroupSelect />
        <InputField fieldKey="content" label="간단한기록" />
        <SaveButton onClick={saveData}>저장</SaveButton>
      </FormContainer>
    </>
  );
}
