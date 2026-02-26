// src/pages/Presentation/components/VideoModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Slider, FormControlLabel, Checkbox } from '@mui/material';

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

export default function VideoModal({ open, onClose, onSave, initialData }) {
    const [videoSource, setVideoSource] = useState('');
    const [videoSize, setVideoSize] = useState(50);
    const [autoPlay, setAutoPlay] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setVideoSource(initialData.source || '');
                setVideoSize(initialData.size || 50);
                setAutoPlay(initialData.autoPlay || false);
            } else {
                setVideoSource('');
                setVideoSize(50);
                setAutoPlay(false);
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        if (!videoSource.trim()) return;

        onSave({
            type: 'video',
            source: videoSource,
            size: Number(videoSize),
            autoPlay: autoPlay,
            position: initialData?.position || { x: 25, y: 25 },
        });
        onClose();
    };

    const formatYouTubeUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return url;
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#0e1318' }}>
                    {initialData ? 'Edit Video' : 'Add Video'}
                </Typography>

                <TextField
                    fullWidth
                    label="Video Embed URL (e.g., YouTube)"
                    value={videoSource}
                    onChange={(e) => setVideoSource(e.target.value)}
                    onBlur={() => setVideoSource(formatYouTubeUrl(videoSource))}
                    margin="normal"
                    placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    helperText="Please use the 'embed' URL format for YouTube videos."
                />


                {videoSource && (
                    <Box
                        mt={2}
                        mb={2}
                        style={{
                            width: '100%',
                            aspectRatio: '16/9',
                            background: '#000000',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)'
                        }}
                    >
                        <iframe
                            src={videoSource}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                            title="Video Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </Box>
                )}

                <Box mt={2} mb={1}>
                    <Typography variant="body2" style={{ color: '#5e6d77', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                        <span>Video Size</span>
                        <span style={{ color: '#d83b01' }}>{videoSize}%</span>
                    </Typography>
                    <Slider
                        value={videoSize}
                        onChange={(e, newValue) => setVideoSize(newValue)}
                        min={10}
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

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={autoPlay}
                            onChange={(e) => setAutoPlay(e.target.checked)}
                            sx={{ color: '#d83b01', '&.Mui-checked': { color: '#d83b01' } }}
                        />
                    }
                    label={<Typography style={{ fontWeight: 500, color: '#0e1318' }}>Auto-Play Video</Typography>}
                    style={{ marginTop: '5px', display: 'block' }}
                />

                <Button
                    variant="contained"
                    onClick={handleSave}
                    style={{ marginTop: '24px', backgroundColor: '#d83b01', width: '100%', padding: '12px', fontWeight: 'bold' }}
                >
                    {initialData ? 'Update Video' : 'Add Video'}
                </Button>
            </Box>
        </Modal>
    );
}