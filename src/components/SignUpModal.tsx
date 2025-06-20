import React, { useState } from 'react';
import styled from '@emotion/styled';
import { supabase } from '../lib/supabase';
import { useRive } from 'rive-react';
import { Layout, Fit, Alignment } from 'rive-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose?: () => void;
  standalone?: boolean;
}

const validateEmail = (email: string) => {
  // Validate email format, email must be in the format of example@domain.com
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Signup modal component, allows users to sign up for the waitlist
export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, standalone = false }) => {
  const { RiveComponent } = useRive({
    src: 'Bravo_Panting.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    animations: 'Panting',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', email)
        .single();

      // If email already exists, set error message
      if (existingEmail) {
        setError('This email is already on the waitlist!');
        setIsSubmitting(false);
        return;
      }

      // Insert email into Supabase
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([
          { 
            email,
            signed_up_at: new Date().toISOString(),
            source: window.location.hostname
          }
        ]);

      // If there's an error, throw it
      if (supabaseError) throw supabaseError;

      // Set success state and clear email input
      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If modal is not open and not standalone, return null
  if (!isOpen && !standalone) return null;

  const content = (
    <>
      {isSuccess ? (
        <SuccessContent>
          <h2>🎉 You're on the list!</h2>
          <p>We'll notify you as soon as BravoBall launches.</p>
        </SuccessContent>
      ) : (
        <>
          <ModalHeader>
            <BravoAnimationWrapper>
              <RiveComponent />
            </BravoAnimationWrapper>
            <h2>Join the Waitlist</h2>
            <p>Be the first to know when BravoBall launches!</p>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitButton disabled={isSubmitting}>
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </SubmitButton>
          </form>
        </>
      )}
    </>
  );

  // If standalone, render content directly
  if (standalone) {
    return <StandaloneWrapper>{content}</StandaloneWrapper>;
  }

  // Otherwise render in modal
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {content}
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  position: relative;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 85%;
    margin: auto;
    max-height: 90vh;
    overflow-y: auto;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    color: #333;
    font-size: 1.5rem;
    margin: 1rem 0 0.5rem;
  }
  
  p {
    color: #666;
    margin: 0;
  }
`;

const BravoAnimationWrapper = styled.div`
  width: 140px;
  height: 140px;
  margin: 0 auto 1rem;
  margin-bottom: 30px;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 1rem;
  box-sizing: border-box;
  
  &:focus {
    border-color: #F6C356;
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 16px;
  }
`;

const SubmitButton = styled.button`
  background: #F6C356;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  margin-top: 0.5rem;
  
  &:hover {
    background: #E5B347;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const SuccessContent = styled.div`
  text-align: center;
  padding: 1rem;
  
  h2 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
  }
`;

const StandaloneWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 100%;
  text-align: center;
`;