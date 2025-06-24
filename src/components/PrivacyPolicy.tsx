import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

interface PrivacySection {
  id: string;
  title: string;
  content: string;
}

interface PrivacyPolicy {
  lastUpdated: string;
  sections: PrivacySection[];
}

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

const LastUpdated = styled.p`
  color: #888;
  font-size: 1rem;
  margin-bottom: 2.5rem;
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

const SectionContent = styled.div`
  color: #4b4b4b;
  font-size: 1.08rem;
  line-height: 1.7;
  font-family: 'Poppins', sans-serif;
  white-space: pre-line;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: #d32f2f;
  flex-direction: column;
`;

const PrivacyPolicy: React.FC = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch('/privacy-policy.json');
        if (!response.ok) {
          throw new Error('Failed to fetch privacy policy');
        }
        const data = await response.json();
        setPrivacyPolicy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPrivacyPolicy();
  }, []);

  if (loading) {
    return (
      <LoadingWrapper>
        <div style={{ color: '#F6C356', fontSize: 28, fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Loading…</div>
      </LoadingWrapper>
    );
  }

  if (error) {
    return (
      <ErrorWrapper>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Error Loading Privacy Policy</div>
        <div>{error}</div>
      </ErrorWrapper>
    );
  }

  if (!privacyPolicy) {
    return null;
  }

  return (
    <Card>
      <Title>Privacy Policy</Title>
      <LastUpdated>Last updated: {privacyPolicy.lastUpdated}</LastUpdated>
      {privacyPolicy.sections.map((section) => (
        <Section key={section.id}>
          <SectionTitle>{section.title}</SectionTitle>
          <SectionContent>{section.content}</SectionContent>
        </Section>
      ))}
    </Card>
  );
};

export default PrivacyPolicy; 