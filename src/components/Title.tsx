import React from 'react'
import { Typography, Box } from '@mui/material'

interface TitleProps {
    title: string;
}

const Title: React.FC<TitleProps> = ({title}) => {
  return (
    <Box>
      <Typography variant="h4" align="center" sx={{ fontFamily: 'BIZ UDPGothic'}}>{title}</Typography>
    </Box>
  )
}

export default Title;