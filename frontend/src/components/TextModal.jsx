import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, InputLabel, Select, MenuItem } from '@mui/material';

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

export default function TextModal({ open, onClose, onSave, initialData }) {
    // 以前在 PresentationPage 里的状态，现在由 Modal 自己管理
    const [textContent, setTextContent] = useState('');
    const [textSize, setTextSize] = useState(50);
    const [fontSize, setFontSize] = useState(1);
    const [textColor, setTextColor] = useState('#000000');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

    // 当 Modal 打开时，判断是“新增”还是“编辑”来初始化表单数据
    useEffect(() => {
        if (open) {
            if (initialData) {
                // 编辑模式：填充已有数据
                setTextContent(initialData.text || '');
                setTextSize(initialData.size || 50);
                setFontSize(initialData.fontSize || 1);
                setTextColor(initialData.color || '#000000');
                setFontFamily(initialData.fontFamily || 'Arial');
                setTextPosition(initialData.position || { x: 0, y: 0 });
            } else {
                // 新增模式：重置为空/默认值
                setTextContent('');
                setTextSize(50);
                setFontSize(1);
                setTextColor('#000000');
                setFontFamily('Arial');
                setTextPosition({ x: 0, y: 0 });
            }
        }
    }, [open, initialData]);

    // 点击保存时，把数据打包传给父组件，然后关闭 Modal
    const handleSave = () => {
        if (textContent.trim() === '') return;

        onSave({
            type: 'text',
            text: textContent,
            size: Number(textSize),
            fontSize: Number(fontSize),
            color: textColor,
            fontFamily,
            position: textPosition,
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    {initialData ? 'Edit Text Element' : 'Add Text Element'}
                </Typography>
                <TextField fullWidth label="Text Content" value={textContent} onChange={(e) => setTextContent(e.target.value)} margin="normal" />
                <TextField fullWidth label="Size (%)" type="number" value={textSize} onChange={(e) => setTextSize(e.target.value)} margin="normal" />
                <TextField fullWidth label="Font Size (em)" type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} margin="normal" />
                <TextField fullWidth label="Text Color" type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} margin="normal" />
                <InputLabel id="font-family-label">Font Family</InputLabel>
                <Select labelId="font-family-label" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} fullWidth margin="normal">
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                    <MenuItem value="Courier New">Courier New</MenuItem>
                </Select>
                <TextField fullWidth label="Position X (%)" type="number" value={textPosition.x} onChange={(e) => setTextPosition({ ...textPosition, x: e.target.value })} margin="normal" />
                <TextField fullWidth label="Position Y (%)" type="number" value={textPosition.y} onChange={(e) => setTextPosition({ ...textPosition, y: e.target.value })} margin="normal" />

                <Button variant="contained" onClick={handleSave} style={{ marginTop: '20px' }}>
                    {initialData ? 'Save Changes' : 'Add Text'}
                </Button>
            </Box>
        </Modal>
    );
}