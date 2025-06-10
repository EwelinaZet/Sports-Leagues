import React from 'react';
import { render, screen } from '../../utils/test-utils';
import Skeleton from '../Skeleton';

describe('Skeleton Components', () => {
  describe('Base', () => {
    it('renders with default props', () => {
      render(<Skeleton.Base data-testid="skeleton-base" />);
      const skeleton = screen.getByTestId('skeleton-base');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveStyle({
        height: '16px',
        width: '100%',
        margin: '0'
      });
    });

    it('renders with custom props', () => {
      render(
        <Skeleton.Base
          data-testid="skeleton-base"
          height="50px"
          width="150px"
          margin="15px"
        />
      );
      const skeleton = screen.getByTestId('skeleton-base');
      expect(skeleton).toHaveStyle({
        height: '50px',
        width: '150px',
        margin: '15px'
      });
    });
  });

  describe('Title', () => {
    it('renders with correct default styles', () => {
      render(<Skeleton.Title data-testid="skeleton-title" />);
      const skeleton = screen.getByTestId('skeleton-title');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveStyle({
        height: '24px',
        marginBottom: '16px'
      });
    });

    it('renders with custom width', () => {
      render(<Skeleton.Title data-testid="skeleton-title" width="300px" />);
      const skeleton = screen.getByTestId('skeleton-title');
      expect(skeleton).toHaveStyle({
        width: '300px'
      });
    });
  });

  describe('Text', () => {
    it('renders with correct default styles', () => {
      render(<Skeleton.Text data-testid="skeleton-text" />);
      const skeleton = screen.getByTestId('skeleton-text');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveStyle({
        height: '16px',
        marginBottom: '8px'
      });
    });

    it('renders with custom width', () => {
      render(<Skeleton.Text data-testid="skeleton-text" width="80%" />);
      const skeleton = screen.getByTestId('skeleton-text');
      expect(skeleton).toHaveStyle({
        width: '80%'
      });
    });
  });

  describe('Card', () => {
    it('renders with correct default styles', () => {
      render(<Skeleton.Card data-testid="skeleton-card" />);
      const skeleton = screen.getByTestId('skeleton-card');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveStyle({
        background: 'white',
        borderRadius: '8px',
        padding: '20px'
      });
    });

    it('renders children correctly', () => {
      render(
        <Skeleton.Card data-testid="skeleton-card">
          <Skeleton.Title data-testid="skeleton-title" />
          <Skeleton.Text data-testid="skeleton-text" />
        </Skeleton.Card>
      );
      expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-title')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-text')).toBeInTheDocument();
    });
  });
}); 