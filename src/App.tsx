import React, { useState } from 'react';
import { useRive } from 'rive-react';
import styled from '@emotion/styled';
import { Layout, Fit, Alignment } from 'rive-react';
import { SignUpModal } from './components/SignUpModal';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SignUpPage } from './SignUp';
import { FeatureSection } from './components/FeatureSection';
import { BenefitCard } from './components/BenefitCard';

function App() {
  const { RiveComponent } = useRive({
    src: 'Bravo_Panting.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    animations: 'Panting',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);

  const benefits = [
    {
      icon: '🤖',
      title: 'AI-Powered Training',
      description: 'Personalized drills that adapt to your level'
    },
    {
      icon: '⚽️',
      title: 'Equipment Flexible',
      description: 'Train with whatever you have available'
    },
    {
      icon: '⚡️',
      title: '60-Second Setup',
      description: 'Quick setup, more time for training'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time'
    }
  ];

  const features = [
    {
      imageSrc: '/bravoball_main.png',
      imageAlt: 'Session Generator Interface',
      title: 'Smart Session Generator',
      description: 'Our AI analyzes your skill level and goals to create personalized training sessions. Get custom drills that adapt to your progress and available equipment for the day.',
      isReversed: false
    },
    {
      imageSrc: '/bravoball_session.png',
      imageAlt: 'Interactive Session Interface',
      title: 'Interactive Training Sessions',
      description: 'Follow along with guided sessions featuring drill videos and real-time timing. Watch demonstrations, time your drills, and track your performance as you train.',
      isReversed: true
    },
    {
      imageSrc: '/bravoball_questions.png',
      imageAlt: 'Drill Catalog Interface',
      title: 'Personalized Setup',
      description: 'Tell us about your goals, available equipment, and space. We\'ll create the perfect training plan just for you.',
      isReversed: false
    },
    {
      imageSrc: '/bravoball_progress.png',
      imageAlt: 'Progress Tracking Interface',
      title: 'Track Your Progress',
      description: 'Monitor your improvement over time with detailed progress tracking. See your skill development visualized and get insights on areas to focus on.',
      isReversed: true
    }
  ];

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={
          <Container>
            <Nav>
              <NavGroup>
                <LogoWrapper>
                  <img src="/bravo_head.png" alt="Bravo" />
                </LogoWrapper>
                <Logo>BravoBall</Logo>
              </NavGroup>
              <NavEnd>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </NavEnd>
            </Nav>

            <MainContent>
              <HeroSection>
                <div>
                  <MainHeading>Personalized drills. Any place, any equipment, on-demand.</MainHeading>
                  <GetStartedButton onClick={handleOpenModal}>Sign Up Now</GetStartedButton>
                </div>
                <AnimationWrapper>
                  <RiveComponent />
                </AnimationWrapper>
              </HeroSection>

              <BenefitsSection>
                {benefits.map((benefit, index) => (
                  <BenefitCard
                    key={index}
                    icon={benefit.icon}
                    title={benefit.title}
                    description={benefit.description}
                  />
                ))}
              </BenefitsSection>

              {features.map((feature, index) => (
                <FeatureSection
                  key={index}
                  imageSrc={feature.imageSrc}
                  imageAlt={feature.imageAlt}
                  title={feature.title}
                  description={feature.description}
                  isReversed={feature.isReversed}
                />
              ))}

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
        } />
      </Routes>
    </Router>
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
  display: flex;
  gap: 1rem;
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

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

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

const MainHeading = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  color: #4b4b4b;
  margin-bottom: 2rem;
  line-height: 1.2;
  text-align: center;
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

interface ButtonProps {
  as?: React.ElementType;
  to?: string;
}

const Button = styled.button<ButtonProps>`
  display: inline-block;
  width: auto;
  padding: 1.2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: none;
  text-decoration: none;
`;

const GetStartedButton = styled(Button)`
  background-color: #F6C356;
  color: #fff;
  border: none;
  padding: 0.875rem 1.75rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: 0 4px 0 #DAA520;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  
  &:hover {
    transform: translateY(-1px);
    background-color: #FDDA0D;
    color: #fff;
    text-decoration: none;
  }
  
  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #FDDA0D;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    min-width: 120px;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: #4b4b4b;
  transition: color 0.2s ease;

  &:hover {
    color: #F6C356;
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
