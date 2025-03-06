import React, { useState } from 'react';
import { useRive } from 'rive-react';
import styled from '@emotion/styled';
import { Layout, Fit, Alignment } from 'rive-react';
import { SignUpModal } from './components/SignUpModal';

function App() {
  const { RiveComponent } = useRive({
    src: 'Bravo_Panting.riv',
    autoplay: true,
    stateMachines: 'Panting',
    animations: 'Panting',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <Container>
      <Nav>
        <NavGroup>
          <LogoWrapper>
            <img src="/bravo_head.png" alt="Bravo" />
          </LogoWrapper>
          <Logo>BravoBall</Logo>
        </NavGroup>
        <NavEnd>
          <NavButton onClick={handleOpenModal}>Sign Up Now</NavButton>
        </NavEnd>
      </Nav>

      <MainContent>
        <HeroSection>
          <div>
            <MainHeading>Start Small. Dream Big.</MainHeading>
            <Subtitle>Personalized drills. Any place, any equipment, on-demand.</Subtitle>
            <GetStartedButton onClick={handleOpenModal}>Sign Up Now</GetStartedButton>
    </div>
          <AnimationWrapper>
            <RiveComponent />
          </AnimationWrapper>
        </HeroSection>

        <BenefitsSection>
          <Benefit>
            <BenefitIcon>🤖</BenefitIcon>
            <BenefitTitle>AI-Powered Training</BenefitTitle>
            <BenefitText>Personalized drills that adapt to your level</BenefitText>
          </Benefit>
          <Benefit>
            <BenefitIcon>⚽️</BenefitIcon>
            <BenefitTitle>Equipment Flexible</BenefitTitle>
            <BenefitText>Train with whatever you have available</BenefitText>
          </Benefit>
          <Benefit>
            <BenefitIcon>⚡️</BenefitIcon>
            <BenefitTitle>60-Second Setup</BenefitTitle>
            <BenefitText>Quick setup, more time for training</BenefitText>
          </Benefit>
          <Benefit>
            <BenefitIcon>📈</BenefitIcon>
            <BenefitTitle>Progress Tracking</BenefitTitle>
            <BenefitText>Monitor your improvement over time</BenefitText>
          </Benefit>
        </BenefitsSection>

        <FeatureGrid>
          <FeatureImage>
            <img src="/bravoball_main.png" alt="Session Generator Interface" />
          </FeatureImage>
          <FeatureContent>
            <FeatureTitle>Smart Session Generator</FeatureTitle>
            <FeatureDescription>
              Our AI analyzes your skill level and goals to create personalized training sessions. 
              Get custom drills that adapt to your progress and available equipment for the day.
            </FeatureDescription>
          </FeatureContent>
        </FeatureGrid>

        <FeatureGrid>
          <FeatureImage>
            <img src="/bravoball_questions.png" alt="Drill Catalog Interface" />
          </FeatureImage>
          <FeatureContent>
            <FeatureTitle>Personalized Setup</FeatureTitle>
            <FeatureDescription>
              Tell us about your goals, available equipment, and space. 
              We'll create the perfect training plan just for you.
            </FeatureDescription>
          </FeatureContent>
        </FeatureGrid>

        <FeatureGrid>
          <FeatureImage>
            <img src="/bravoball_progress.png" alt="Progress Tracking Interface" />
          </FeatureImage>
          <FeatureContent>
            <FeatureTitle>Track Your Progress</FeatureTitle>
            <FeatureDescription>
              Monitor your improvement over time with detailed progress tracking. 
              See your skill development visualized and get insights on areas to focus on.
            </FeatureDescription>
          </FeatureContent>
        </FeatureGrid>

        <CTASection>
          <CTAImageWrapper>
            <img src="/bravo_head.png" alt="Bravo" />
          </CTAImageWrapper>
          <CTATitle>Ready to transform your game?</CTATitle>
          <GetStartedButton onClick={handleOpenModal}>Sign Up Now</GetStartedButton>
        </CTASection>

        <Footer>
          <Copyright>© {new Date().getFullYear()} BravoBall. All rights reserved.</Copyright>
        </Footer>
      </MainContent>

      <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #fff;
  color: #4b4b4b;
  font-family: 'Poppins', -apple-system, system-ui, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  padding: 0;
  width: 100%;
  position: relative;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 48px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  z-index: 1000;

  max-width: 800;
  margin: 0 auto;
  padding: 0.75rem 15%;

  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
  }
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const NavEnd = styled.div`
  margin-right: 0;
`;

const LogoWrapper = styled.div`
  height: 40px;
  margin-top: 2px;
  
  img {
    height: 100%;
    width: auto;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  font-family: 'Potta One', cursive;
  color: #F6C356;
  display: flex;
  align-items: center;
`;

const SiteLanguage = styled.div`
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
`;

const MainContent = styled.main`
  max-width: 1080px;
  margin: 0 auto;
  padding: 72px 24px 0;
  background-color: #fff;
`;

const HeroSection = styled.div`
  padding: 6rem 0 8rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
  margin: 0 auto;
  max-width: 960px;
  direction: rtl;

  > * {
    direction: ltr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 4rem 1rem;
    text-align: center;
    gap: 1rem;
    direction: ltr;

    display: flex;
    flex-direction: column-reverse;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 600px;
`;

const MainHeading = styled.h1`
  font-size: 1.75rem;
  font-weight: 900;
  font-family: 'Poppins', sans-serif;
  color: #4b4b4b;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #777;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  text-align: center;
`;

const TagLine = styled.div`
  font-family: 'Poppins', sans-serif;
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: #333;
  margin: 3rem 0;
`;

const AnimationWrapper = styled.div`
  height: 360px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
    max-width: 450px;
    object-fit: contain;
  }
  
  @media (max-width: 768px) {
    height: 280px;
    margin-bottom: 2rem;
    
    canvas {
      max-width: 360px;
    }
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 1.2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: none;
`;

const GetStartedButton = styled(Button)`
  background-color: #F6C356;
  color: #fff;
  border: none;
  width: auto;
  padding: 0.875rem 1.75rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: 0 4px 0 #DAA520;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-1px);
    background-color: #FDDA0D;
  }
  
  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #FDDA0D;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
`;

const NavButton = styled(GetStartedButton)`
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  margin: 0;
  box-shadow: 0 3px 0 #DAA520;
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 0 #FDDA0D;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const BenefitsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
  margin: 0 auto;
  max-width: 960px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const Benefit = styled.div`
  text-align: center;
  padding: 1rem;
  flex: 1;
  max-width: 200px;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const BenefitIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: #4b4b4b;
`;

const BenefitTitle = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #4b4b4b;
  margin-bottom: 0.5rem;
`;

const BenefitText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #777;
  line-height: 1.4;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem 0;
  margin-top: 1rem;
  border-top: 1px solid #EEEEEE;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
    margin-top: 0.5rem;
  }
`;

const Copyright = styled.p`
  color: #999;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const FeatureGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem 2rem;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  
  &:nth-of-type(even) {
    direction: rtl;
    
    > * {
      direction: ltr;
    }
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

const CTASection = styled.section`
  text-align: center;
  padding: 8rem 2rem;
  background: #fff;
  margin: 0;
  position: relative;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const CTAImageWrapper = styled.div`
  width: 140px;
  margin: 0 auto 1.5rem;
  animation: float 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 100px;
    margin-bottom: 1rem;
  }
  
  img {
    width: 100%;
    height: auto;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

const CTATitle = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

export default App;
