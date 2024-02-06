import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box 
      className="flex justify-center items-center h-16 bg-gray-100 text-sm border-t border-gray-300"
      component="footer"
    >
      <Typography variant="caption">
        浙ICP备2024057702号
      </Typography>
    </Box>
  );
};

export default Footer;