// App.tsx

import './App.css';
import { Box, Typography } from '@mui/material';
import ImageUploader from './components/ImageUploader';
import Title from './components/Title';
import LineComponent from './components/LineComponent';

function App() {
  const description = `画像をアップロードすると、Webサイトの作成に必要なfaviconセットを一発で作成します。`;
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Box sx={{ alignSelf: 'center', textAlign: 'center', width: '100%' }}>
          <Title title="One-Punch-favicon" />
          <LineComponent />
          <Typography variant="body1" align="center" fontFamily={'BIZ UDPGothic'} margin={'30px 0'}>
            {description}
          </Typography>
        </Box>
        <Box sx={{ justifyContent: 'center', width: '100%' }}> {/* 横幅100% */}
          <ImageUploader />
        </Box>
      </Box>

    </div>
  );
}

export default App;


