import React from 'react';
import styled from '@emotion/styled';
import { SignUpModal } from './components/SignUpModal';
import { Link } from 'react-router-dom';

export const SignUpPage = () => {
  return (
    <Container>
      <Nav>
        <div>
          <NavGroup>
            <LogoWrapper>
              <img src="/bravo_head.png" alt="Bravo" />
            </LogoWrapper>
            <Logo>BravoBall</Logo>
          </NavGroup>
          <NavEnd>
            <NavButton as={Link} to="/">Home</NavButton>
            <NavButton as={Link} to="/signup">Sign Up</NavButton>
          </NavEnd>
        </div>
      </Nav>
      
      <SignUpWrapper>
        <SignUpModal isOpen={true} standalone={true} />
      </SignUpWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-x: hidden;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  z-index: 1000;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  > div {
    width: 100%;
    max-width: 1080px;
    padding: 0.75rem max(24px, 5%);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: 768px) {
    > div {
      padding: 0.75rem 1.25rem;
    }
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

const NavButton = styled.button<{ as?: React.ElementType; to?: string }>`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: #4b4b4b;
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;
  margin: 0;

  &:hover {
    color: #F6C356;
  }
`;

const SignUpWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 120px auto 2rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    margin: 100px auto 2rem;
    padding: 0 1.25rem;
  }
`;