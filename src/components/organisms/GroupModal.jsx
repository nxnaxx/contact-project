import { useState } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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

const GroupModalContainer = styled.div`
  position: relative;
  width: 400px;
  padding: 32px 40px;
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

const GroupList = styled.ul`
  list-style: none;
  overflow-y: auto;
  max-height: 320px;
  margin-bottom: 24px;
  padding-right: 16px;
`;

const GroupItem = styled.li`
  display: flex;
  margin-bottom: 24px;
  font-size: var(--fs-xl);

  &:nth-last-of-type(1) {
    margin-bottom: 0;
  }
`;

const DeleteGroupButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  cursor: pointer;
  pointer-events: auto;
  color: var(--gray-500);

  svg {
    width: 20px;
    height: 20px;
  }

  &:disabled {
    cursor: auto;
    pointer-events: none;
    color: var(--gray-300);
  }
`;

const GroupInputWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const GroupInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid var(--gray-500);
  border-radius: 4px;
  font-size: var(--fs-l);

  &::placeholder {
    color: var(--gray-500);
  }
`;

const AddGroupButton = styled.button`
  padding: 12px 16px;
  border-radius: 4px;
  background-color: var(--primary);
  color: var(--white);
  font-size: var(--fs-l);

  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default function GroupModal({ groups, setGroups, hanldeToggleModal }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => setInputValue(e.target.value);

  const deleteGroup = (value) => {
    const updatedGroups = groups.filter((group) => group !== value);
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
  };

  const addGroup = () => {
    const newValue = inputValue.trim();
    if (!newValue) return;

    const updatedGroups = [...groups, newValue];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setInputValue('');
  };

  const checkDuplicateGroup = (group) => {
    const storedContacts =
      JSON.parse(localStorage.getItem('contactList')) || [];
    const storedGroups = JSON.parse(localStorage.getItem('groups')) || [];

    // group이 하나라면 삭제 불가
    if (storedGroups.length === 1) return true;

    return storedContacts.some((contact) => contact.group === group);
  };

  return (
    <Backdrop>
      <GroupModalContainer>
        <CloseButton onClick={hanldeToggleModal}>닫기</CloseButton>
        <ModalTitle>그룹 관리</ModalTitle>
        <GroupList>
          {groups.map((group, idx) => (
            <GroupItem key={idx}>
              {group}
              <DeleteGroupButton
                disabled={checkDuplicateGroup(group)}
                onClick={() => deleteGroup(group)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </DeleteGroupButton>
            </GroupItem>
          ))}
        </GroupList>
        <GroupInputWrapper>
          <GroupInput
            type="text"
            value={inputValue}
            placeholder="새 그룹 이름"
            onChange={handleInputChange}
          />
          <AddGroupButton onClick={addGroup}>추가</AddGroupButton>
        </GroupInputWrapper>
      </GroupModalContainer>
    </Backdrop>
  );
}
