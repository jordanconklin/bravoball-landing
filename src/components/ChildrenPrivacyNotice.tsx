import React from 'react';
import { LegalDocumentPage } from './PrivacyPolicy';

// Children's privacy notice linked from the COPPA parental consent email.
// Text mirrors the backend's /parental-consent/privacy page.
const ChildrenPrivacyNotice: React.FC = () => (
  <LegalDocumentPage title="Children's Privacy Notice" source="/children-privacy-notice.json" />
);

export default ChildrenPrivacyNotice;
