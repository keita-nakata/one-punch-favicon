// App.tsx

import './App.css';
import { Box, Typography } from '@mui/material';
import ImageUploader from './components/ImageUploader';
import Title from './components/Title';

function App() {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: 'column', 
        alignItems: 'center', // 中央寄せに戻す
        justifyContent: 'flex-start', 
        minHeight: '100vh', 
        width: '100%', // 横幅いっぱい
      }}
    >
      <Box sx={{ alignSelf: 'center', textAlign: 'center', width: '100%' }}> 
        <Title title="faviconセット 一発作成" />
        <Typography variant="body1" align="center" fontFamily={'BIZ UDPGothic'}>
          画像をアップロードすると、faviconセットを一発で作成します。
        </Typography>
      </Box>
      <Box sx={{ justifyContent: 'center', width: '100%' }}> {/* 横幅100% */}
        <ImageUploader />
      </Box>
    </Box>
  );
}

export default App;


