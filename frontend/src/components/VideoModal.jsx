// src/components/VideoModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';

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

export default function VideoModal({ open, onClose, onSave, initialData }) {
    const [videoSource, setVideoSource] = useState('');
    const [videoSize, setVideoSize] = useState(50);
    const [videoAutoPlay, setVideoAutoPlay] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setVideoSource(initialData.source || '');
                setVideoSize(initialData.size || 50);
                setVideoAutoPlay(initialData.autoPlay || false);
            } else {
                setVideoSource('');
                setVideoSize(50);
                setVideoAutoPlay(false);
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        if (!videoSource.trim()) return;

        onSave({
            type: 'video',
            source: videoSource,
            size: Number(videoSize),
            autoPlay: videoAutoPlay,
            // 视频的 position 和其他元素保持一致结构，可以在外部或这里默认给 {x:0, y:0}
            position: initialData?.position || { x: 0, y: 0 },
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    {initialData ? 'Edit Video Element' : 'Add Video Element'}
                </Typography>

                <TextField fullWidth label="Video URL (YouTube embedded URL etc.)" value={videoSource} onChange={(e) => setVideoSource(e.target.value)} margin="normal" />
                <TextField fullWidth label="Size (%)" type="number" value={videoSize} onChange={(e) => setVideoSize(e.target.value)} margin="normal" />

                <FormControlLabel
                    control={<Checkbox checked={videoAutoPlay} onChange={(e) => setVideoAutoPlay(e.target.checked)} />}
                    label="Auto-Play"
                    style={{ marginTop: '10px', display: 'block' }}
                />

                <Button variant="contained" onClick={handleSave} style={{ marginTop: '20px' }}>
                    {initialData ? 'Save Changes' : 'Add Video'}
                </Button>
            </Box>
        </Modal>
    );
}