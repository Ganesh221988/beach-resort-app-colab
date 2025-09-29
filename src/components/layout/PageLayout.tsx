import React from 'react';
import { Box, Container, Typography, Breadcrumbs } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title, breadcrumbs }) => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {breadcrumbs && (
          <Breadcrumbs sx={{ mb: 2 }}>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Typography color="text.primary" key={crumb.label}>
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  component={RouterLink}
                  to={crumb.path || '#'}
                  color="inherit"
                  key={crumb.label}
                  underline="hover"
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}
        <Typography
          variant="h1"
          sx={{
            mb: 4,
            fontSize: { xs: '1.875rem', md: '2.25rem' },
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
};
