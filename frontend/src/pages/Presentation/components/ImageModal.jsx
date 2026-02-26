// src/pages/Presentation/components/ImageModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Slider } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
};

export default function ImageModal({ open, onClose, onSave, initialData }) {
    const [imageSource, setImageSource] = useState('');
    const [imageSize, setImageSize] = useState(50);
    const [altText, setAltText] = useState('');

    useEffect(() => {
        if (open) {
            if (initialData) {
                setImageSource(initialData.source || '');
                setImageSize(initialData.size || 50);
                setAltText(initialData.alt || '');
            } else {
                setImageSource('');
                setImageSize(50);
                setAltText('');
            }
        }
    }, [open, initialData]);

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
            position: initialData?.position || { x: 30, y: 30 },
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#0e1318' }}>
                    {initialData ? 'Edit Image' : 'Add Image'}
                </Typography>

                <TextField
                    fullWidth
                    label="Image URL"
                    value={imageSource}
                    onChange={(e) => setImageSource(e.target.value)}
                    margin="normal"
                    placeholder="https://example.com/image.png"
                />

                <Typography variant="body2" align="center" style={{ margin: '15px 0', color: '#a0abb2', fontWeight: 600 }}>
                    — OR —
                </Typography>

                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    style={{
                        borderColor: '#e2e6ea',
                        color: '#5e6d77',
                        padding: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderStyle: 'dashed',
                        borderWidth: '2px',
                    }}
                >
                    📂 Upload from Computer
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>

                {imageSource && (
                    <Box
                        mt={2}
                        style={{
                            height: '140px',
                            background: '#f1f3f5',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            padding: '10px'
                        }}
                    >
                        <img src={imageSource} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </Box>
                )}

                <Box mt={3} mb={1}>
                    <Typography variant="body2" style={{ color: '#5e6d77', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                        <span>Image Size</span>
                        <span style={{ color: '#d83b01' }}>{imageSize}%</span>
                    </Typography>
                    <Slider
                        value={imageSize}
                        onChange={(e, newValue) => setImageSize(newValue)}
                        min={5}
                        max={100}
                        sx={{
                            color: '#d83b01',
                            '& .MuiSlider-thumb': {
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: '0px 0px 0px 8px rgba(216, 59, 1, 0.16)',
                                },
                            },
                        }}
                    />
                </Box>

                <TextField
                    fullWidth
                    label="Alt Text (for accessibility)"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    margin="dense"
                    size="small"
                />

                <Button
                    variant="contained"
                    onClick={handleSave}
                    style={{ marginTop: '24px', backgroundColor: '#d83b01', width: '100%', padding: '12px', fontWeight: 'bold' }}
                >
                    {initialData ? 'Update Image' : 'Add Image'}
                </Button>
            </Box>
        </Modal>
    );
}