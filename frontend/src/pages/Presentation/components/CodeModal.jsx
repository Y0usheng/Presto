// src/components/CodeModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, InputLabel, Select, MenuItem } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function CodeModal({ open, onClose, onSave, initialData }) {
    const [codeContent, setCodeContent] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [codeFontSize, setCodeFontSize] = useState(1);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setCodeContent(initialData.code || '');
                setCodeLanguage(initialData.language || 'javascript');
                setCodeFontSize(initialData.fontSize || 1);
            } else {
                setCodeContent('');
                setCodeLanguage('javascript');
                setCodeFontSize(1);
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
            // 原代码默认给的 {x:0, y:0}，如果有初始数据则保留原位置
            position: initialData?.position || { x: 0, y: 0 },
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    {initialData ? 'Edit Code Block' : 'Add Code Block'}
                </Typography>

                <InputLabel id="language-label">Language</InputLabel>
                <Select
                    labelId="language-label"
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    fullWidth
                    margin="dense"
                >
                    <MenuItem value="javascript">JavaScript</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="c">C</MenuItem>
                </Select>

                <TextField
                    fullWidth
                    label="Code Content"
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    margin="dense"
                    multiline
                    rows={6}
                />

                <TextField
                    fullWidth
                    label="Font Size (em)"
                    type="number"
                    value={codeFontSize}
                    onChange={(e) => setCodeFontSize(e.target.value)}
                    margin="dense"
                />

                <Button variant="contained" onClick={handleSave} style={{ marginTop: '20px' }}>
                    {initialData ? 'Save Changes' : 'Add Code'}
                </Button>
            </Box>
        </Modal>
    );
}