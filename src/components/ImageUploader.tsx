import React, { useState } from 'react';
import { Button, Box, Typography, Link } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const API_ENDPOINT = 'https://favicon-maker-f731ab933b02.herokuapp.com/favicon';

const ImageUploader: React.FC = () => {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [DownloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (base64_image: string) => {
    const requestBody = { "base64_image": base64_image };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        setDownloadUrl(result.zipfile_url);
        console.log('アップロード成功:', result.zipfile_url);
      } else {
        console.error('アップロード失敗:', response.statusText);
        setError('アップロードに失敗しました。');
      }
    } catch (error) {
      console.error('エラー発生:', error);
      setError('エラーが発生しました。');
    }
  };

  const handleImageUpload = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setBase64Image(base64String);
      handleSubmit(base64String.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleClickUpload = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: 2,
          width: '100%',   // widthをパーセンテージに変更
          maxWidth: '1000px', // 最大幅を1000pxに制限
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          margin: '0 auto', // 水平方向の中央揃え
        }}
      >
        {/* ドラッグアンドドロップまたはクリックで画像を選択 */}
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUpload}
          sx={{
            border: '2px dashed gray',
            borderRadius: '8px',
            width: '90%',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDragging ? '#f0f0f0' : '#fff',
            cursor: 'pointer',
          }}
        >
          <UploadFileIcon style={{ fontSize: 50 }} />
          <Typography variant="subtitle1" fontFamily={'BIZ UDPGothic'}>
            ここにファイルをドラッグするか、クリックして選択
          </Typography>
        </Box>

        <input
          type="file"
          accept="image/*"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        <Box>
          {DownloadUrl ? (
            <Link href={DownloadUrl} download underline="none">
              <Button variant="contained" color="primary">
                <ArrowCircleDownIcon />
                ダウンロード
              </Button>
            </Link>
          ) : (
            <Button variant="contained" color="primary" disabled>
              <ArrowCircleDownIcon />
              ダウンロード
            </Button>
          )}
        </Box>
      </Box>
      {fileName &&
        <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{
            border: '1px solid',
            borderRadius: '8px',
            padding: '8px',
            margin: '16px',
          }}>
            <Typography variant="subtitle1">アップロードファイル</Typography>
            <Typography variant="subtitle1">{fileName}</Typography>
          </Box>
          <PlayArrowIcon style={{ fontSize: '50px' }} />
          <Box sx={{
            margin: '16px',
          }}>
            {base64Image && <img src={base64Image} alt="preview" style={{ width: '200px', borderRadius: '8px' }} />}
          </Box>
          {error && <Typography variant="subtitle1" color="error">{error}</Typography>}
        </Box>
      }
    </Box>
  );
};

export default ImageUploader;
