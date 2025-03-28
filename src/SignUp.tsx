import React from 'react';
import styled from '@emotion/styled';
import { SignUpModal } from './components/SignUpModal';
import { Link } from 'react-router-dom';

export const SignUpPage = () => {
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
          <NavButton as={Link} to="/">Home</NavButton>
          <NavButton as={Link} to="/signup">Sign Up</NavButton>
        </NavEnd>
      </Nav>
      
      <SignUpWrapper>
        <SignUpModal isOpen={true} standalone={true} />
      </SignUpWrapper>

      <Footer>
        <Copyright>© {new Date().getFullYear()} BravoBall. All rights reserved.</Copyright>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #fff;
  padding: 1rem;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 15%;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  z-index: 1000;

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
  margin: 7rem auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem 0;
  margin-top: 7rem;
  border-top: 1px solid #EEEEEE;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
    margin-top: 7rem;
  }
`;

const Copyright = styled.p`
  color: #999;
  font-size: 0.875rem;
  margin-top: 1rem;
`;