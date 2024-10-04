import React, { useState } from 'react';
import { Button, Box, Typography, Link } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const API_ENDPOINT = 'http://127.0.0.1:8000/favicon';

const ImageUploader: React.FC = () => {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [DownloadUrl, setDownloadUrl] = useState<string | null>(null);

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
      } else {
        console.error('アップロード失敗:', response.statusText);
      }
    } catch (error) {
      console.error('エラー発生:', error);
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

      {fileName && <Typography variant="subtitle1">{fileName}</Typography>}
      {base64Image && <img src={base64Image} alt="preview" style={{ width: '200px', borderRadius: '8px' }} />}
    </Box>

  );
};

export default ImageUploader;
