// src/pages/Presentation/components/TextModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';

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

const FONTS = ['Inter', 'Arial', 'Roboto', 'Times New Roman', 'Courier New', 'Comic Sans MS', 'Impact', 'Georgia'];

export default function TextModal({ open, onClose, onSave, initialData }) {
    const [textContent, setTextContent] = useState('');
    const [fontSize, setFontSize] = useState(2);
    const [color, setColor] = useState('#0e1318');
    const [fontFamily, setFontFamily] = useState('Inter');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setTextContent(initialData.text || '');
                setFontSize(initialData.fontSize || 2);
                setColor(initialData.color || '#0e1318');
                setFontFamily(initialData.fontFamily || 'Inter');
                setIsBold(initialData.isBold || false);
                setIsItalic(initialData.isItalic || false);
            } else {
                setTextContent('');
                setFontSize(2);
                setColor('#0e1318');
                setFontFamily('Inter');
                setIsBold(false);
                setIsItalic(false);
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        if (textContent.trim() === '') return;

        onSave({
            type: 'text',
            text: textContent,
            fontSize: Number(fontSize),
            color: color,
            fontFamily: fontFamily,
            isBold: isBold,
            isItalic: isItalic,
            position: initialData?.position || { x: 40, y: 40 },
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#0e1318' }}>
                    {initialData ? 'Edit Text' : 'Add New Text'}
                </Typography>

                <TextField fullWidth label="Text Content" value={textContent} onChange={(e) => setTextContent(e.target.value)} margin="normal" multiline rows={3} autoFocus />

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <TextField label="Font Size (em)" type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} fullWidth inputProps={{ step: 0.5, min: 0.5 }} />
                    <FormControl fullWidth>
                        <InputLabel>Font</InputLabel>
                        <Select value={fontFamily} label="Font" onChange={(e) => setFontFamily(e.target.value)}>
                            {FONTS.map(font => <MenuItem key={font} value={font} style={{ fontFamily: font }}>{font}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                    <FormControlLabel control={<Checkbox checked={isBold} onChange={(e) => setIsBold(e.target.checked)} />} label="Bold" />
                    <FormControlLabel control={<Checkbox checked={isItalic} onChange={(e) => setIsItalic(e.target.checked)} />} label="Italic" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#5e6d77', fontWeight: 500 }}>Color:</span>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ cursor: 'pointer', width: '40px', height: '40px', border: 'none', padding: 0, background: 'transparent' }} />
                </div>

                <Button variant="contained" onClick={handleSave} style={{ marginTop: '30px', backgroundColor: '#d83b01', width: '100%', padding: '10px' }}>
                    {initialData ? 'Update Text' : 'Add Text'}
                </Button>
            </Box>
        </Modal>
    );
}