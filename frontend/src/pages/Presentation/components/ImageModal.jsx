// src/components/ImageModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function ImageModal({ open, onClose, onSave, initialData }) {
    const [imageSource, setImageSource] = useState('');
    const [imageSize, setImageSize] = useState(50);
    const [altText, setAltText] = useState('');
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setImageSource(initialData.source || '');
                setImageSize(initialData.size || 50);
                setAltText(initialData.alt || '');
                setImagePosition(initialData.position || { x: 0, y: 0 });
            } else {
                setImageSource('');
                setImageSize(50);
                setAltText('');
                setImagePosition({ x: 0, y: 0 });
            }
        }
    }, [open, initialData]);

    // 处理图片文件上传转换为 Base64 的逻辑也封装在这里！
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSource(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!imageSource.trim()) return;

        onSave({
            type: 'image',
            source: imageSource,
            size: Number(imageSize),
            alt: altText,
            position: imagePosition,
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    {initialData ? 'Edit Image Element' : 'Add Image Element'}
                </Typography>

                <TextField fullWidth label="Image URL" value={imageSource} onChange={(e) => setImageSource(e.target.value)} margin="normal" />

                {/* 图片上传 */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginTop: '10px', marginBottom: '10px', display: 'block' }}
                />

                <TextField fullWidth label="Size (%)" type="number" value={imageSize} onChange={(e) => setImageSize(e.target.value)} margin="normal" />
                <TextField fullWidth label="Alt Text" value={altText} onChange={(e) => setAltText(e.target.value)} margin="normal" />
                <TextField fullWidth label="Position X (%)" type="number" value={imagePosition.x} onChange={(e) => setImagePosition({ ...imagePosition, x: e.target.value })} margin="normal" />
                <TextField fullWidth label="Position Y (%)" type="number" value={imagePosition.y} onChange={(e) => setImagePosition({ ...imagePosition, y: e.target.value })} margin="normal" />

                <Button variant="contained" onClick={handleSave} style={{ marginTop: '20px' }}>
                    {initialData ? 'Save Changes' : 'Add Image'}
                </Button>
            </Box>
        </Modal>
    );
}