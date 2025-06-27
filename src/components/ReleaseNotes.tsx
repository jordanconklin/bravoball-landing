import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

interface Issue {
  title: string;
  description: string;
  status: string;
}

interface PastVersion {
  version: string;
  date: string;
  notes: string[];
}

interface IssuesData {
  currentVersion: string;
  releaseDate: string;
  note?: string;
  knownIssues: Issue[];
  pastVersions: PastVersion[];
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

const IssueCard = styled.div`
  background: #f9f7f2;
  border-radius: 12px;
  padding: 1.1rem 1.2rem 1.1rem 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(246,195,86,0.07);
`;

const IssueTitle = styled.div`
  font-weight: 600;
  color: #4b4b4b;
  font-size: 1.08rem;
  margin-bottom: 0.2rem;
`;

const IssueStatus = styled.span`
  background: #F6C356;
  color: #fff;
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.18em 0.7em;
  margin-left: 0.7em;
`;

const IssueDesc = styled.div`
  color: #666;
  font-size: 1rem;
  margin-bottom: 0.2rem;
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

const ReleaseMeta = styled.div`
  color: #888;
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const ReleaseNotes: React.FC = () => {
  const [data, setData] = useState<IssuesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/issues.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch issues');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Card>Loading…</Card>;
  if (error) return <Card>Error: {error}</Card>;
  if (!data) return null;

  return (
    <Card>
      <Title>Known Issues & Updates</Title>
      <ReleaseMeta>
        Version {data.currentVersion} &middot; Released {data.releaseDate}
      </ReleaseMeta>
      {data.note && <Note>{data.note}</Note>}

      <Section>
        <SectionTitle>Known Issues</SectionTitle>
        {data.knownIssues.length === 0 && <div>No known issues at this time.</div>}
        {data.knownIssues.map((issue, i) => (
          <IssueCard key={i}>
            <IssueTitle>
              {issue.title}
              <IssueStatus>{issue.status}</IssueStatus>
            </IssueTitle>
            <IssueDesc>{issue.description}</IssueDesc>
          </IssueCard>
        ))}
      </Section>

      <Section>
        <SectionTitle>Past Versions</SectionTitle>
        {data.pastVersions.map((ver, i) => (
          <div key={i} style={{ marginBottom: '1.2rem' }}>
            <div style={{ fontWeight: 600, color: '#4b4b4b', fontSize: '1.05rem' }}>
              {ver.version} <span style={{ color: '#888', fontWeight: 400 }}>({ver.date})</span>
            </div>
            <List>
              {ver.notes.map((note, j) => (
                <ListItem key={j}>{note}</ListItem>
              ))}
            </List>
          </div>
        ))}
      </Section>
    </Card>
  );
};

export default ReleaseNotes; 