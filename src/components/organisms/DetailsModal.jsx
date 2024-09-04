import { useState } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../molecules/InputField';
import { useFormContext } from '../contexts/FormContext';
import GroupSelect from '../molecules/GroupSelect';

const Backdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 40%);
`;

const DetailsModalContainer = styled.div`
  position: relative;
  width: 364px;
  padding: 32px;
  border-radius: 8px;
  background-color: var(--white);
  box-shadow: 0 8px 12px 0 rgb(0 0 0 / 20%);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -64px;
  left: 50%;
  padding: 12px;
  border-radius: 4px;
  background: var(--orange);
  color: var(--white);
  transform: translateX(-50%);

  &:hover {
    background-color: var(--primary);
  }
`;

const ModalTitle = styled.h2`
  margin-bottom: 32px;
  text-align: center;
`;

const DetailContent = styled.ul`
  list-style: none;
`;

const DetailItem = styled.li`
  display: flex;
  gap: 8px;
  min-height: 38px;
  margin-bottom: 16px;
  font-size: var(--fs-l);
  line-height: 38px;

  &:nth-last-of-type(1) {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.strong`
  min-width: 64px;
  height: 38px;
`;

const EditButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px;
  border-radius: 4px;
  color: var(--primary);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: var(--gray-300);
  }
`;

const SaveButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px;
  border-radius: 4px;
  color: var(--primary);

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background-color: var(--gray-300);
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

export default function DetailsModal({ details, hanldeToggleModal }) {
  const [detailData, setDetailData] = useState(details);
  const [isEditable, setIsEditable] = useState(false);
  const { data, setData, initialData } = useFormContext();

  const nameNotify = () => toast.warn('동일한 이름이 존재합니다.', toastStyle);
  const phoneNotify = () =>
    toast.warn('동일한 전화번호가 존재합니다.', toastStyle);

  const editInfo = () => {
    setIsEditable((isEditable) => !isEditable);
  };

  const saveInfo = () => {
    const storedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    const storedContacts =
      JSON.parse(localStorage.getItem('contactList')) || [];

    if (storedGroups.length === 0) return alert('그룹을 추가해주세요.');

    if (data.group.value === '') data.group.value = storedGroups[0];

    // 정보가 수정되지 않았을 경우 이전 값 그대로 저장
    const sameData = storedContacts.find(
      (contact) => contact.name === detailData.name,
    );
    const isEqual = Object.keys(sameData).every((key) => {
      return sameData[key] === data[key];
    });

    if (isEqual) return setIsEditable((isEditable) => !isEditable);

    // 동명이인이 리스트에 존재할 경우, toast 표출
    if (
      storedContacts.find(
        (contact) =>
          contact.name !== detailData.name && contact.name === data.name.value,
      )
    ) {
      return nameNotify();
    }

    // 동일한 전화번호가 리스트에 존재할 경우, toast 표출
    if (
      storedContacts.find(
        (contact) =>
          contact.phoneNumber !== detailData.phoneNumber &&
          contact.phoneNumber === data.phoneNumber.value,
      )
    ) {
      return phoneNotify();
    }

    const allValid = Object.values(data).every((field) => !field.isValid);

    if (allValid) {
      const newContact = Object.entries(data).reduce(
        (acc, [key, { value }]) => {
          acc[key] = value.trim();
          return acc;
        },
        {},
      );
      const updatedContacts = storedContacts.map((contact) =>
        contact.name === detailData.name
          ? { ...contact, ...newContact }
          : contact,
      );

      localStorage.setItem('contactList', JSON.stringify(updatedContacts));
      setDetailData(newContact);
      setData(initialData);
    } else return alert('모든 항목을 올바르게 입력해주세요.');

    setIsEditable((isEditable) => !isEditable);
  };

  return (
    <Backdrop>
      <ToastContainer />
      <DetailsModalContainer>
        <CloseButton onClick={hanldeToggleModal}>닫기</CloseButton>
        <ModalTitle>연락처 상세 정보</ModalTitle>
        <DetailContent>
          <DetailItem>
            <DetailLabel>이름:</DetailLabel>{' '}
            {isEditable ? (
              <InputField
                fieldKey="name"
                initValue={detailData.name}
                regexPattern={/^[가-힣]{2,}$/}
                errormessage="이름은 한글로 두 글자 이상 입력해주세요."
              />
            ) : (
              detailData.name
            )}
          </DetailItem>
          <DetailItem>
            <DetailLabel>전화번호:</DetailLabel>{' '}
            {isEditable ? (
              <InputField
                fieldKey="phoneNumber"
                initValue={detailData.phoneNumber}
                regexPattern={/^010-\d{3,4}-\d{4}$/}
                errormessage="전화번호는 010-0000-0000 형식으로 입력해주세요."
              />
            ) : (
              detailData.phoneNumber
            )}
          </DetailItem>
          <DetailItem>
            <DetailLabel>그룹:</DetailLabel>{' '}
            {isEditable ? (
              <GroupSelect initValue={detailData.group} />
            ) : (
              detailData.group
            )}
          </DetailItem>
          <DetailItem>
            <DetailLabel>메모:</DetailLabel>{' '}
            {isEditable ? (
              <InputField fieldKey="content" initValue={detailData.content} />
            ) : (
              detailData.content || '-'
            )}
          </DetailItem>
        </DetailContent>
        {isEditable ? (
          <SaveButton onClick={saveInfo}>
            <FontAwesomeIcon icon={faCircleCheck} />
          </SaveButton>
        ) : (
          <EditButton onClick={editInfo}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </EditButton>
        )}
      </DetailsModalContainer>
    </Backdrop>
  );
}
