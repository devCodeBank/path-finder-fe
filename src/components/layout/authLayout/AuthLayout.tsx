import Carousel from "@components/carousel/Carousel";
import type { Slide } from "@components/carousel/Carousel";
import LoadingSpinner from "@components/loading";
import Logo from "@components/logo/Logo";
import { Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { selectIsLoading } from "@redux/selectors/authSelectors";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const MainContainer = styled(Box)`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  position: relative;
  overflow: hidden;

  @media (max-width: 899px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.tokens.color.background.primary};
  position: relative;
  flex: 1;
  width: 50%;

  @media (max-width: 899px) {
    width: 100%;
    flex: none;
    height: 100vh;
    overflow: hidden;
  }
`;

const FormContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(4)};
  padding-top: 10vh;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 100vh;

  @media (max-width: 899px) {
    padding: ${({ theme }) => theme.spacing(2)};
    padding-top: ${({ theme }) => theme.spacing(6)};
    min-height: auto;
    height: 100%;
  }
`;

const ScrollableContent = styled(Box)`
  width: 100%;
  max-width: 35rem; /* max-w-md equivalent (560px) */
  display: flex;
  flex-direction: column;
  gap: 10vh;

  @media (max-width: 899px) {
    gap: ${({ theme }) => theme.spacing(4)};
  }
`;

const LogoWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

const FormContent = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RightColumn = styled(Box)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.tokens.color.brand.primaryFocus} 0%,
    ${({ theme }) => theme.tokens.color.brand.primaryDark} 100%
  );
  position: relative;
  overflow: hidden;
  height: 100vh;
  flex: 1;
  width: 50%;
  border-radius: 24px 0 0 24px;

  @media (max-width: 899px) {
    display: none;
  }

  @media (min-width: 900px) {
    padding-left: ${({ theme }) => theme.spacing(6)};
  }
`;

const slides: Slide[] = [
  {
    image: "",
    title: "Introducing new features",
    description:
      "Customise your search! Define keywords and our system will intelligently parse resumes to find the perfect matches, faster.",
  },
  {
    image: "",
    title: "Smart Resume Parsing",
    description: "Our AI automatically extracts key information from resumes, making candidate evaluation faster and more accurate.",
  },
  {
    image: "",
    title: "Advanced Analytics",
    description: "Get insights into your hiring process with detailed analytics and reporting features.",
  },
  {
    image: "",
    title: "Seamless Integration",
    description: "Connect with your existing tools and workflows for a streamlined hiring experience.",
  },
];

const AuthLayout: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const isLoading = useSelector(selectIsLoading);

  return (
    <MainContainer>
      <LeftColumn>
        <LoadingSpinner
          isLoading={isLoading}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            backgroundColor: (theme: Theme) => theme.tokens.color.overlay.whiteHeavy,
          }}
        />
        <FormContainer>
          <ScrollableContent>
            <LogoWrapper>
              <Logo size="large" />
            </LogoWrapper>
            <FormContent>
              <Outlet />
            </FormContent>
          </ScrollableContent>
        </FormContainer>
      </LeftColumn>

      <RightColumn>
        <Carousel slides={slides} currentIndex={current} onChange={setCurrent} />
      </RightColumn>
    </MainContainer>
  );
};

export default AuthLayout;
