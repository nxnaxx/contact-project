import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useFormContext } from '../contexts/FormContext';
import GroupModal from '../organisms/GroupModal';
import usePreventScroll from '../../hooks/usePreventScroll';

const GroupSelectContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SelectLabel = styled.label`
  min-width: 96px;
`;

const Select = styled.select`
  flex: 1;
  margin-right: 12px;
  padding: 8px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
`;

const Option = styled.option``;

const AddGroupButton = styled.button`
  height: 100%;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: var(--gray-300);

  &:hover {
    background-color: var(--primary-lighter);
  }
`;

export default function GroupSelect({ label, initValue }) {
  const defaultGroups = ['가족', '친구', '직장', '스터디'];
  const [groups, setGroups] = useState(defaultGroups);
  const [currentGroup, setCurrentGroup] = useState(
    initValue || defaultGroups[0],
  );
  const { setData } = useFormContext();
  const { isOpened, handleToggleOpen } = usePreventScroll(false);

  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem('groups'));

    if (storedGroups && storedGroups.length > 0) setGroups(storedGroups);
    else {
      setGroups(defaultGroups);
      localStorage.setItem('groups', JSON.stringify(defaultGroups));
    }
  }, []);

  useEffect(() => {
    if (initValue) {
      setData((prevData) => ({
        ...prevData,
        group: {
          ...prevData.group,
          value: initValue,
        },
      }));
    }
  }, [initValue]);

  const handleSelectChange = (e) => {
    const selectedGroup = e.target.value;

    setData((prevData) => ({
      ...prevData,
      group: {
        ...prevData.group,
        value: selectedGroup,
      },
    }));
    setCurrentGroup(selectedGroup);
  };

  return (
    <>
      {isOpened && (
        <GroupModal
          groups={groups}
          setGroups={setGroups}
          hanldeToggleModal={handleToggleOpen}
        />
      )}
      <GroupSelectContainer>
        {label && <SelectLabel>{label}</SelectLabel>}
        <Select onChange={handleSelectChange} value={currentGroup}>
          {groups.map((group, idx) => (
            <Option key={idx} value={group}>
              {group}
            </Option>
          ))}
        </Select>
        <AddGroupButton onClick={handleToggleOpen}>그룹 추가</AddGroupButton>
      </GroupSelectContainer>
    </>
  );
}
