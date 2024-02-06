'use client'
import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="lg" style={{ paddingTop: '2rem', paddingBottom: '2rem' }} component="main">
      <Typography variant="h4" component="h1" gutterBottom>
        Acknowledgements
      </Typography>
      
      <Paper style={{ padding: '2rem', marginTop: '1rem',minHeight:'screen' }}>
        <Grid container spacing={3}>
          {/* First row */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="h2">
              Research Team
            </Typography>
            <Typography>
              Description of the research team and its members{`'`} contributions.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="h2">
              Website Development
            </Typography>
            <Typography>
              <li>thy</li>
              <li>lxy</li>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="h2">
              Administration
            </Typography>
            <Typography>
              <li>ZJU Xlab</li>
            </Typography>
          </Grid>
          
          {/* Second row */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h2">
              Contact Email
            </Typography>
            <Typography>
              contact@example.com
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h2">
              Third-party visualizations used
            </Typography>
            <Typography>
              <div className='flex flex-col space-y-3 mt-3'>
                <li>Crystal structure:</li>
                <Link href="https://web.chemdoodle.com/" className='text-blue-600 font-semibold'>https://web.chemdoodle.com/</Link>
                <Link href="https://www.npmjs.com/package/chemdoodle-next" className='text-blue-600 font-semibold'>https://www.npmjs.com/package/chemdoodle-next</Link>
              </div>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} className='mt-20'>
            <Typography>
              When using the data and information on this website in a publication, please cite the following three papers and two websites:
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutPage;