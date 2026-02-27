// src/pages/Presentation/components/BackgroundModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

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

export default function BackgroundModal({ open, onClose, onSave, currentBackground }) {
    const [background, setBackground] = useState('#ffffff');

    useEffect(() => {
        if (open) {
            setBackground(currentBackground || '#ffffff');
        }
    }, [open, currentBackground]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackground(`url(${reader.result})`);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(background);
        onClose();
    };

    const isImage = background.startsWith('url');

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#0e1318' }}>
                    Edit Slide Background
                </Typography>

                <div style={{ marginTop: '15px' }}>
                    <Typography variant="body2" style={{ color: '#5e6d77', fontWeight: 600 }}>Solid Color / CSS Code:</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <input
                            type="color"
                            value={/^#[0-9A-Fa-f]{6}$/i.test(background) ? background : '#ffffff'}
                            onChange={(e) => setBackground(e.target.value)}
                            style={{ cursor: 'pointer', width: '40px', height: '40px', border: 'none', padding: 0, background: 'transparent', opacity: isImage ? 0.3 : 1 }}
                            disabled={isImage}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            value={isImage ? 'Image Background Applied' : background}
                            onChange={(e) => setBackground(e.target.value)}
                            disabled={isImage}
                        />
                    </div>
                </div>

                <Typography variant="body2" align="center" style={{ margin: '20px 0', color: '#a0abb2', fontWeight: 600 }}>
                    — OR —
                </Typography>

                <div>
                    <Typography variant="body2" style={{ color: '#5e6d77', fontWeight: 600, marginBottom: '10px' }}>Background Image:</Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: '#e2e6ea', color: '#5e6d77', textTransform: 'none', padding: '10px', fontWeight: 'bold' }}
                    >
                        📂 Upload Image from Computer
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>

                    {isImage && (
                        <Box mt={2}>
                            <Box
                                style={{
                                    height: '140px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e6ea',
                                    backgroundImage: background,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Button
                                color="error"
                                fullWidth
                                onClick={() => setBackground('#ffffff')}
                                style={{ marginTop: '10px', textTransform: 'none', fontWeight: 'bold' }}
                            >
                                🗑️ Remove Image & Reset to White
                            </Button>
                        </Box>
                    )}
                </div>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    style={{ marginTop: '24px', backgroundColor: '#d83b01', width: '100%', padding: '12px', fontWeight: 'bold' }}
                >
                    Apply Background
                </Button>
            </Box>
        </Modal>
    );
}