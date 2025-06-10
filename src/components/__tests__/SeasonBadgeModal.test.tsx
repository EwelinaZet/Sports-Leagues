import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import SeasonBadgeModal from '../SeasonBadgeModal';

describe('SeasonBadgeModal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    badgeUrl: 'https://example.com/badge.png',
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders badge when open', () => {
    render(<SeasonBadgeModal {...defaultProps} />);
    
    const badgeImage = screen.getByAltText('Season Badge');
    expect(badgeImage).toBeInTheDocument();
    expect(badgeImage).toHaveAttribute('src', defaultProps.badgeUrl);
  });

  it('calls onClose when clicking outside modal', () => {
    render(<SeasonBadgeModal {...defaultProps} />);
    
    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside modal', () => {
    render(<SeasonBadgeModal {...defaultProps} />);
    
    const content = screen.getByTestId('modal-content');
    fireEvent.click(content);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<SeasonBadgeModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  it('displays loading state when isLoading is true', () => {
    render(<SeasonBadgeModal {...defaultProps} isLoading={true} badgeUrl={null} />);
    
    expect(screen.getByText('Loading badge...')).toBeInTheDocument();
    expect(screen.queryByAltText('Season Badge')).not.toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const errorMessage = 'Failed to load badge';
    render(<SeasonBadgeModal {...defaultProps} error={errorMessage} badgeUrl={null} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByAltText('Season Badge')).not.toBeInTheDocument();
  });
}); 