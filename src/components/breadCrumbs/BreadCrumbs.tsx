import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";
import styled from "styled-components";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  breadcrumbs: Breadcrumb[];
}

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  font-size: ${({ theme }) => theme.tokens.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
`;

const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.tokens.color.brand.primaryHover};
  }
`;

const StyledSpan = styled.span`
  color: inherit;
  text-decoration: none;
  cursor: default;
  color: ${({ theme }) => theme.tokens.color.neutral.gray150};
  opacity: 0.7;
`;

export const CustomBreadCrumbs: React.FC<BreadCrumbsProps> = ({ breadcrumbs }) => {
  return (
    <StyledBreadcrumbs separator={<ArrowForwardRoundedIcon fontSize="small" color="disabled" />}>
      {breadcrumbs.map((breadcrumb) =>
        breadcrumb.href ? (
          <StyledLink key={breadcrumb.label} href={breadcrumb.href}>
            {breadcrumb.label}
          </StyledLink>
        ) : (
          <StyledSpan key={breadcrumb.label}> {breadcrumb.label}</StyledSpan>
        ),
      )}
    </StyledBreadcrumbs>
  );
};
