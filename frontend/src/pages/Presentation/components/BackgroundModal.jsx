// src/pages/Presentation/components/BackgroundModal.jsx
import React, { useState, useEffect } from 'react';
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
    borderRadius: '12px', /* 圆角更贴合现在的现代 UI */
};

export default function BackgroundModal({ open, onClose, onSave, currentBackground }) {
    const [background, setBackground] = useState('#ffffff');

    // 当模态框打开时，读取当前幻灯片的背景
    useEffect(() => {
        if (open) {
            setBackground(currentBackground || '#ffffff');
        }
    }, [open, currentBackground]);

    const handleSave = () => {
        onSave(background);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#0e1318' }}>
                    Edit Slide Background
                </Typography>

                <TextField
                    fullWidth
                    label="Background (Color Code, Gradient or URL)"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    margin="normal"
                    helperText="e.g. #f6f8fd, linear-gradient(...), or url(...)"
                />

                {/* 提供一个可视化的原生颜色选择器，提升体验 */}
                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#5e6d77' }}>Quick pick a solid color:</span>
                    <input
                        type="color"
                        // 为了防止用户填了 url() 导致原生取色器报错，做个简单的正则匹配
                        value={/^#[0-9A-Fa-f]{6}$/i.test(background) ? background : '#ffffff'}
                        onChange={(e) => setBackground(e.target.value)}
                        style={{
                            cursor: 'pointer',
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            padding: 0,
                            background: 'transparent'
                        }}
                    />
                </div>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    style={{ marginTop: '24px', backgroundColor: '#d83b01', width: '100%' }}
                >
                    Apply Background
                </Button>
            </Box>
        </Modal>
    );
}