import styled from '@emotion/styled';

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
  width: 360px;
  padding: 32px 40px 40px 40px;
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
  margin-bottom: 24px;
  font-size: var(--fs-l);

  &:nth-last-of-type(1) {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.strong``;

export default function DetailsModal({ data, hanldeToggleModal }) {
  const { name, phoneNumber, group, content } = data;

  return (
    <Backdrop>
      <DetailsModalContainer>
        <CloseButton onClick={hanldeToggleModal}>닫기</CloseButton>
        <ModalTitle>연락처 상세 정보</ModalTitle>
        <DetailContent>
          <DetailItem>
            <DetailLabel>이름:</DetailLabel> {name}
          </DetailItem>
          <DetailItem>
            <DetailLabel>전화번호:</DetailLabel> {phoneNumber}
          </DetailItem>
          <DetailItem>
            <DetailLabel>그룹:</DetailLabel> {group}
          </DetailItem>
          <DetailItem>
            <DetailLabel>메모:</DetailLabel> {content || '-'}
          </DetailItem>
        </DetailContent>
      </DetailsModalContainer>
    </Backdrop>
  );
}
