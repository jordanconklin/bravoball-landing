import React from 'react';
import styled from '@emotion/styled';

interface FeatureSectionProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  isReversed?: boolean;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
  isReversed = false,
}) => {
  return (
    <FeatureGrid isReversed={isReversed}>
      <FeatureImage>
        <img src={imageSrc} alt={imageAlt} />
      </FeatureImage>
      <FeatureContent>
        <FeatureTitle>{title}</FeatureTitle>
        <FeatureDescription>{description}</FeatureDescription>
      </FeatureContent>
    </FeatureGrid>
  );
};

const FeatureGrid = styled.section<{ isReversed: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem 2rem;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  direction: ${props => props.isReversed ? 'rtl' : 'ltr'};
  
  > * {
    direction: ltr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
    padding: 2.5rem 1rem;
    direction: ltr;
  }
`;

const FeatureImage = styled.div`
  border-radius: 16px;
  padding: 1.5rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  @media (max-width: 768px) {
    min-height: auto;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const FeatureContent = styled.div`
  max-width: 440px;
`;

const FeatureTitle = styled.h2`
  font-family: 'Potta One', cursive;
  font-size: 2rem;
  font-weight: 400;
  color: #fff;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #F6C356, #E5B347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const FeatureDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  line-height: 1.6;
  color: #999;
  max-width: 700px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`; 