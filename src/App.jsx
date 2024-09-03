import styled from '@emotion/styled';
import { FormContextProvider } from './components/contexts/FormContext';
import ContactForm from './components/organisms/ContactForm';
import ContactList from './components/organisms/ContactList';

const Title = styled.h1`
  margin-bottom: 48px;
  text-align: center;
`;

const MainContainer = styled.main`
  display: flex;
  gap: 64px;
  max-width: 1124px;
  margin: auto;
`;

function App() {
  return (
    <FormContextProvider>
      <Title>연락처 리스트</Title>
      <MainContainer>
        <ContactForm />
        <ContactList />
      </MainContainer>
    </FormContextProvider>
  );
}

export default App;
