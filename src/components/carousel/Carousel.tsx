import { KeyboardArrowLeft, KeyboardArrowRight, Psychology } from "@mui/icons-material";
import { Box, Typography, MobileStepper, Button } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import React from "react";
import styled from "styled-components";

export interface Slide {
  /** URL or import of the promo image */
  image: string;
  /** Slide heading */
  title: string;
  /** Slide body text */
  description: string;
}

interface CarouselProps {
  slides: Slide[];
  /** zero-based index of current slide */
  currentIndex: number;
  /** called with the new index when user clicks next/back */
  onChange: (newIndex: number) => void;
}

const Root = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${({ theme }: { theme: Theme }) => theme.spacing(6)};
  color: ${({ theme }: { theme: Theme }) => theme.tokens.color.neutral.white};
  text-align: center;
  box-sizing: border-box;
`;

const ContentArea = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const IconContainer = styled(Box)`
  width: 120px;
  height: 120px;
  background: ${({ theme }) => theme.tokens.color.overlay.whiteLight};
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }: { theme: Theme }) => theme.spacing(4)};
  backdrop-filter: blur(5px);
  border: 1px solid ${({ theme }) => theme.tokens.color.overlay.whiteMedium};
`;

const AIIcon = styled(Psychology)`
  font-size: 48px;
  color: ${({ theme }: { theme: Theme }) => theme.tokens.color.neutral.white};
`;

const Title = styled(Typography)`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: ${({ theme }: { theme: Theme }) => theme.spacing(3)};
  max-width: 400px;
`;

const Description = styled(Typography)`
  font-size: 18px;
  line-height: 1.6;
  max-width: 420px;
  min-height: 128px;
  margin-bottom: ${({ theme }: { theme: Theme }) => theme.spacing(4)};
  opacity: 1;
`;

const NavigationContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }: { theme: Theme }) => theme.spacing(24)};
  width: 100%;
`;

const StyledMobileStepper = styled(MobileStepper)`
  background: ${({ theme }) => theme.tokens.color.overlay.transparent};
  justify-content: center;
  padding: 0;
  position: static;

  .MuiMobileStepper-dots {
    .MuiMobileStepper-dot {
      background-color: ${({ theme }) => theme.tokens.color.overlay.whiteSemi};
      width: 12px;
      height: 12px;
      margin: 0 6px;

      &.MuiMobileStepper-dotActive {
        background-color: ${({ theme }: { theme: Theme }) => theme.tokens.color.neutral.white};
      }
    }
  }
`;

const NavigationButton = styled(Button)`
  background: ${({ theme }) => theme.tokens.color.overlay.transparent};
  color: ${({ theme }: { theme: Theme }) => theme.tokens.color.neutral.white};
  border: none;
  border-radius: 50%;
  min-width: 48px;
  box-shadow: none;
  width: 48px;
  height: 48px;
  padding: 0;

  &:hover {
    background: ${({ theme }) => theme.tokens.color.overlay.whiteLight};
  }

  &:disabled {
    color: ${({ theme }) => theme.tokens.color.overlay.whiteStrong};

    &:hover {
      background: ${({ theme }) => theme.tokens.color.overlay.transparent};
    }
  }
`;

const Carousel: React.FC<CarouselProps> = ({ slides, currentIndex, onChange }) => {
  const maxIndex = slides.length - 1;
  const { title, description } = slides[currentIndex];

  const handleNext = () => currentIndex < maxIndex && onChange(currentIndex + 1);
  const handleBack = () => currentIndex > 0 && onChange(currentIndex - 1);

  return (
    <Root>
      <ContentArea>
        <IconContainer>
          <AIIcon />
        </IconContainer>

        <Title variant="h3">{title}</Title>

        <Description variant="lg">{description}</Description>
      </ContentArea>

      <NavigationContainer>
        <NavigationButton onClick={handleBack} disabled={currentIndex === 0}>
          <KeyboardArrowLeft />
        </NavigationButton>

        <StyledMobileStepper
          variant="dots"
          steps={slides.length}
          position="static"
          activeStep={currentIndex}
          nextButton={<div />}
          backButton={<div />}
        />

        <NavigationButton onClick={handleNext} disabled={currentIndex === maxIndex}>
          <KeyboardArrowRight />
        </NavigationButton>
      </NavigationContainer>
    </Root>
  );
};

export default Carousel;
