import React from 'react'
import { Typography, Box } from '@mui/material'

interface TitleProps {
    title: string;
}

const Title: React.FC<TitleProps> = ({title}) => {
  return (
    <Box>
      <Typography variant="h4" align="center" sx={{ fontFamily: 'BIZ UDPGothic', marginBottom: '10px'}}>{title}</Typography>
    </Box>
  )
}

export default Title;