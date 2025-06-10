import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div<{ height?: string; width?: string; margin?: string }>`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0'};
`;

export const SkeletonTitle = styled(SkeletonBase)`
  height: 24px;
  margin-bottom: 16px;
`;

export const SkeletonText = styled(SkeletonBase)`
  height: 16px;
  margin-bottom: 8px;
  
  &:last-child {
    width: 80%;
  }
`;

export const SkeletonCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Skeleton = {
  Title: SkeletonTitle,
  Text: SkeletonText,
  Card: SkeletonCard,
  Base: SkeletonBase
};

export default Skeleton; 