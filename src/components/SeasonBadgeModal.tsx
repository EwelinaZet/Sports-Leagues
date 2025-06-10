import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 5px;
  line-height: 1;

  &:hover {
    color: #000;
  }
`;

const BadgeImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 20px;
  color: #dc3545;
`;

interface SeasonBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const SeasonBadgeModal: React.FC<SeasonBadgeModalProps> = ({
  isOpen,
  onClose,
  badgeUrl,
  isLoading,
  error
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay 
      onClick={onClose} 
      data-testid="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Season Badge"
    >
      <ModalContent 
        onClick={e => e.stopPropagation()} 
        data-testid="modal-content"
        role="document"
      >
        <CloseButton 
          onClick={onClose} 
          aria-label="Close modal"
          data-testid="modal-close-button"
        >
          &times;
        </CloseButton>
        {isLoading && (
          <LoadingText role="status" aria-live="polite">
            Loading badge...
          </LoadingText>
        )}
        {error && (
          <ErrorText role="alert" aria-live="assertive">
            {error}
          </ErrorText>
        )}
        {badgeUrl && (
          <BadgeImage 
            src={badgeUrl} 
            alt="Season Badge" 
            data-testid="badge-image"
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SeasonBadgeModal; 