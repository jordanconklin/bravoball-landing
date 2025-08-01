import React, { useEffect } from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1.5px 4px rgba(0,0,0,0.04);
  padding: 2.5rem 2rem;
  max-width: 700px;
  margin: 48px auto 0 auto;
  font-family: 'Poppins', -apple-system, system-ui, BlinkMacSystemFont, sans-serif;
  color: #4b4b4b;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #F6C356;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
`;

const Note = styled.div`
  background: #f9f7f2;
  color: #b48a1c;
  font-size: 1.08rem;
  border-radius: 10px;
  padding: 0.9rem 1.2rem;
  margin-bottom: 1.7rem;
  font-family: 'Poppins', sans-serif;
`;

const Section = styled.section`
  margin-bottom: 2.2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.18rem;
  font-weight: 700;
  color: #F6C356;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
`;

const StepCard = styled.div`
  background: #f9f7f2;
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(246,195,86,0.07);
`;

const StepNumber = styled.span`
  background: #F6C356;
  color: #fff;
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.18em 0.7em;
  margin-right: 0.7em;
`;

const StepTitle = styled.div`
  font-weight: 600;
  color: #4b4b4b;
  font-size: 1.08rem;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
`;

const StepDesc = styled.div`
  color: #666;
  font-size: 1rem;
  margin-left: 2.5rem;
`;

const List = styled.ul`
  margin: 0.5rem 0 0 1.2rem;
  padding: 0;
  color: #4b4b4b;
`;

const ListItem = styled.li`
  margin-bottom: 0.4rem;
  font-size: 1rem;
`;

const WarningCard = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1.2rem;
  color: #856404;
`;

const WarningTitle = styled.div`
  font-weight: 600;
  font-size: 1.08rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const ContactInfo = styled.div`
  background: #e8f4fd;
  border: 1px solid #bee5eb;
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-top: 1.5rem;
  color: #0c5460;
`;

const DeleteAccountInfo: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Card>
      <Title>Delete Your BravoBall Account</Title>
      <Note>
        To delete your account and all associated data, follow the steps below using the BravoBall app on your device.
      </Note>

      <Section>
        <SectionTitle>How to Delete Your Account</SectionTitle>
        
        <StepCard>
          <StepTitle>
            <StepNumber>1</StepNumber>
            Open the BravoBall App
          </StepTitle>
          <StepDesc>
            Launch the BravoBall app on your device and sign in to your account.
          </StepDesc>
        </StepCard>

        <StepCard>
          <StepTitle>
            <StepNumber>2</StepNumber>
            Go to Profile Page
          </StepTitle>
          <StepDesc>
            Navigate to the Profile section in the app.
          </StepDesc>
        </StepCard>

        <StepCard>
          <StepTitle>
            <StepNumber>3</StepNumber>
            Access Account Settings
          </StepTitle>
          <StepDesc>
            Tap on "Manage Account" to access your account settings.
          </StepDesc>
        </StepCard>

        <StepCard>
          <StepTitle>
            <StepNumber>4</StepNumber>
            Delete Account
          </StepTitle>
          <StepDesc>
            Find and tap the "Delete Account" button, then confirm your decision in the prompt.
          </StepDesc>
        </StepCard>
      </Section>

      <Section>
        <SectionTitle>What Gets Deleted</SectionTitle>
        <WarningCard>
          <WarningTitle>⚠️ Permanent Deletion</WarningTitle>
          <div>When you delete your account, the following data is permanently removed:</div>
          <List>
            <ListItem>Your email address and login information</ListItem>
            <ListItem>All saved drills and custom training sessions</ListItem>
            <ListItem>Complete training history and progress metrics</ListItem>
            <ListItem>Session preferences and settings</ListItem>
            <ListItem>Drill groups and saved filters</ListItem>
            <ListItem>All authentication tokens and refresh tokens</ListItem>
          </List>
        </WarningCard>
      </Section>

      <Section>
        <SectionTitle>Data Retention</SectionTitle>
        <div style={{ color: '#666', fontSize: '1rem' }}>
          We do not retain any personal data after account deletion. Some anonymized logs may be kept for up to 30 days for security and system maintenance purposes, but these logs contain no personally identifiable information.
        </div>
      </Section>

      <ContactInfo>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Need Help?</div>
        <div>If you have any questions about account deletion or need assistance, please contact our support team.</div>
        <div style={{ marginTop: '0.5rem', fontWeight: 500 }}>
          Email: team@conklinofficial.com
        </div>
      </ContactInfo>
    </Card>
  );
};

export default DeleteAccountInfo; 