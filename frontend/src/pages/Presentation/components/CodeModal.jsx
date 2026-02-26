// src/pages/Presentation/components/CodeModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Slider } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
};

const LANGUAGES = ['javascript', 'python', 'html', 'css', 'c', 'cpp', 'java', 'json', 'bash'];

export default function CodeModal({ open, onClose, onSave, initialData }) {
    const [codeContent, setCodeContent] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [codeFontSize, setCodeFontSize] = useState(1);
    const [codeSize, setCodeSize] = useState(50);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setCodeContent(initialData.code || '');
                setCodeLanguage(initialData.language || 'javascript');
                setCodeFontSize(initialData.fontSize || 1);
                setCodeSize(initialData.size || 50);
            } else {
                setCodeContent('');
                setCodeLanguage('javascript');
                setCodeFontSize(1);
                setCodeSize(50);
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        if (codeContent.trim() === '') return;

        onSave({
            type: 'code',
            language: codeLanguage,
            code: codeContent,
            fontSize: Number(codeFontSize),
            size: Number(codeSize),
            position: initialData?.position || { x: 30, y: 50 },
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#0e1318' }}>
                    {initialData ? 'Edit Code Block' : 'Add Code Block'}
                </Typography>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select value={codeLanguage} label="Language" onChange={(e) => setCodeLanguage(e.target.value)}>
                            {LANGUAGES.map(lang => (
                                <MenuItem key={lang} value={lang}>{lang.toUpperCase()}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Font Size (em)"
                        type="number"
                        value={codeFontSize}
                        onChange={(e) => setCodeFontSize(e.target.value)}
                        inputProps={{ step: 0.1, min: 0.5 }}
                        style={{ width: '150px' }}
                    />
                </div>

                <TextField
                    fullWidth
                    label="Paste your code here"
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    margin="normal"
                    multiline
                    rows={6}
                    sx={{ fontFamily: 'monospace' }}
                />

                {codeContent && (
                    <Box mt={2} mb={2} style={{ maxHeight: '150px', overflow: 'auto', borderRadius: '8px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
                        <SyntaxHighlighter language={codeLanguage} style={vscDarkPlus} customStyle={{ margin: 0, padding: '12px', fontSize: '0.85em' }}>
                            {codeContent}
                        </SyntaxHighlighter>
                    </Box>
                )}

                <Box mt={2} mb={1}>
                    <Typography variant="body2" style={{ color: '#5e6d77', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                        <span>Block Width</span>
                        <span style={{ color: '#d83b01' }}>{codeSize}%</span>
                    </Typography>
                    <Slider
                        value={codeSize}
                        onChange={(e, newValue) => setCodeSize(newValue)}
                        min={10} max={100}
                        sx={{ color: '#d83b01' }}
                    />
                </Box>

                <Button variant="contained" onClick={handleSave} style={{ marginTop: '16px', backgroundColor: '#d83b01', width: '100%', padding: '12px', fontWeight: 'bold' }}>
                    {initialData ? 'Update Code' : 'Add Code'}
                </Button>
            </Box>
        </Modal>
    );
}