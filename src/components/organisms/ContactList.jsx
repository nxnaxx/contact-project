import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import usePreventScroll from '../../hooks/usePreventScroll';
import DetailsModal from './DetailsModal';

const ContactListContainer = styled.div`
  flex: 2;
`;

const SearchForm = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--primary-lighter);
  border-radius: 4px;
  background-color: var(--primary-lighter);

  &::placeholder {
    color: var(--gray-500);
  }

  &:focus {
    border: 1px solid var(--primary);
  }
`;

const OpenAllListButton = styled.button`
  padding: 12px 16px;
  border-radius: 4px;
  background-color: var(--primary);
  color: var(--white);

  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ContactListWrapper = styled.ul``;

const ContactListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px dotted var(--gray-300);
`;

const ContactItemButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-left: auto;
`;

const ContactDetailsButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: var(--gray-300);

  &:hover {
    background-color: var(--primary-lighter);
  }
`;

const DeleteContactButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: var(--gray-300);

  &:hover {
    background-color: var(--primary-lighter);
  }
`;

export default function ContactList() {
  const [contactData, setContactData] = useState(
    JSON.parse(localStorage.getItem('contactList')) || [],
  );
  const { isOpened, handleToggleOpen } = usePreventScroll(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    const pollInterval = 1000;
    const fetchContactData = () => {
      const updatedContactList = JSON.parse(
        localStorage.getItem('contactList'),
      );
      setContactData(updatedContactList || []);
    };

    const intervalId = setInterval(fetchContactData, pollInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleOpenModal = (data = null) => {
    setSelectedContact(data);
    handleToggleOpen();
  };

  const deleteContact = (name) => {
    setContactData((prevData) => {
      const updatedData = prevData.filter((contact) => contact.name !== name);
      localStorage.setItem('contactList', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const query = searchTerm.toLowerCase();
      // 메모를 제외한 이름, 전화번호, 그룹에서만 검색
      const result = contactData.filter((item) => {
        const isNameMatch = item.name.toLowerCase().includes(query);
        const isPhoneNumberMatch = item.phoneNumber
          .toLowerCase()
          .includes(query);
        const isGroupMatch = item.group.toLowerCase().includes(query);
        return isNameMatch || isPhoneNumberMatch || isGroupMatch;
      });
      setFilteredData(result);
      setSearchTerm('');
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const displayAllContacts = () => setFilteredData(null);

  return (
    <>
      {isOpened && selectedContact && (
        <DetailsModal
          data={selectedContact}
          hanldeToggleModal={handleToggleOpen}
        />
      )}
      <ContactListContainer>
        <SearchForm>
          <SearchInput
            type="text"
            value={searchTerm}
            placeholder="검색어를 입력 후 엔터를 누르세요."
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <OpenAllListButton onClick={displayAllContacts}>
            전체리스트 보기
          </OpenAllListButton>
        </SearchForm>
        <ContactListWrapper>
          {filteredData
            ? filteredData.map((data) => {
                const { name, phoneNumber, group } = data;
                return (
                  <ContactListItem key={name}>
                    {name} {phoneNumber} {group}
                    <ContactItemButtonWrapper>
                      <ContactDetailsButton
                        onClick={() => handleOpenModal(data)}
                      >
                        세부사항
                      </ContactDetailsButton>
                      <DeleteContactButton onClick={() => deleteContact(name)}>
                        삭제
                      </DeleteContactButton>
                    </ContactItemButtonWrapper>
                  </ContactListItem>
                );
              })
            : contactData.map((data) => {
                const { name, phoneNumber, group } = data;
                return (
                  <ContactListItem key={name}>
                    {name} {phoneNumber} {group}
                    <ContactItemButtonWrapper>
                      <ContactDetailsButton
                        onClick={() => handleOpenModal(data)}
                      >
                        세부사항
                      </ContactDetailsButton>
                      <DeleteContactButton onClick={() => deleteContact(name)}>
                        삭제
                      </DeleteContactButton>
                    </ContactItemButtonWrapper>
                  </ContactListItem>
                );
              })}
        </ContactListWrapper>
      </ContactListContainer>
    </>
  );
}
