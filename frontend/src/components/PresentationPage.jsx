import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppBar, Toolbar, Typography, IconButton, Button, TextField, Modal, Box, Checkbox, FormControlLabel, MenuItem, Select, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import { SiJavascript, SiPython, SiC } from 'react-icons/si';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);

const SlideArea = styled.div`
    width: 600px;
    height: 400px;
    border: 1px solid #ccc;
    position: relative;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.background};
`;

const SlideNumber = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 50px;
    font-size: 1em;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const VideoWrapper = styled.div`
    position: absolute;
    top: ${(props) => props.position.y}%;
    left: ${(props) => props.position.x}%;
    width: ${(props) => props.size}%;
    border: 2px dashed #ccc;
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

function PresentationPage() {
  const { id, slideNumber } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [setNewThumbnail] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(parseInt(slideNumber) - 1 || 0);

  const [addTextModalOpen, setAddTextModalOpen] = useState(false);
  const [editTextModalOpen, setEditTextModalOpen] = useState(false);

  const [textContent, setTextContent] = useState('');
  const [textSize, setTextSize] = useState(50);
  const [fontSize, setFontSize] = useState(1);
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [editElementIndex, setEditElementIndex] = useState(null);

  const [addImageModalOpen, setAddImageModalOpen] = useState(false);
  const [editImageModalOpen, setEditImageModalOpen] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [imageSize, setImageSize] = useState(50);
  const [altText, setAltText] = useState('');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const [addVideoModalOpen, setAddVideoModalOpen] = useState(false);
  const [editVideoModalOpen, setEditVideoModalOpen] = useState(false);
  const [videoSource, setVideoSource] = useState('');
  const [videoSize, setVideoSize] = useState(50);
  const [videoAutoPlay, setVideoAutoPlay] = useState(false);

  const [addCodeModalOpen, setAddCodeModalOpen] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeFontSize, setCodeFontSize] = useState(1);

  const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);
  const [backgroundType, setBackgroundType] = useState('solid');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [gradientColors, setGradientColors] = useState({ start: '#ffffff', end: '#000000' });
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        const response = await fetch(`http://localhost:5005/store`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          let updatedStore = data.store.filter(p => p.id !== parseInt(id));

          updatedStore = updatedStore.map((presentation, index) => ({
            ...presentation,
            id: index + 1,
          }));

          const updateResponse = await fetch(`http://localhost:5005/store`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ ...data, store: updatedStore }),
          });

          if (updateResponse.ok) {
            navigate('/dashboard');
          } else {
            console.error('Failed to delete presentation');
          }
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error deleting presentation:', error);
      }
    }
  };

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await fetch(`http://localhost:5005/store`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const foundPresentation = data.store.find(p => p.id === parseInt(id));

          if (foundPresentation) {
            setPresentation(foundPresentation);
            setNewTitle(foundPresentation.name);
            setSlides(foundPresentation.slides || []);
          } else {
            console.error('Presentation not found');
          }
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching presentation:', error);
      }
    };

    fetchPresentation();
  }, [id]);

  useEffect(() => {
    navigate(`/presentation/${id}/slide/${currentSlideIndex + 1}`, { replace: true });
  }, [currentSlideIndex, id, navigate]);

  useEffect(() => {
    if (slideNumber) {
      setCurrentSlideIndex(parseInt(slideNumber) - 1);
    }
  }, [slideNumber]);

  const handleTitleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5005/store`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const updatedStore = data.store.map((p) =>
          p.id === parseInt(id) ? { ...p, name: newTitle } : p
        );
        const updateResponse = await fetch(`http://localhost:5005/store`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ ...data, store: updatedStore }),
        });
        if (updateResponse.ok) {
          setPresentation((prev) => ({ ...prev, name: newTitle }));
          setEditTitleOpen(false);
        }
      }
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleThumbnailUpdate = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        if (window.confirm('Are you sure you want to change the thumbnail?')) {
          try {
            const response = await fetch(`http://localhost:5005/store`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              const updatedStore = data.store.map((p) =>
                p.id === parseInt(id) ? { ...p, thumbnail: base64String } : p
              );
              const updateResponse = await fetch(`http://localhost:5005/store`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ ...data, store: updatedStore }),
              });
              if (updateResponse.ok) {
                setPresentation((prev) => ({ ...prev, thumbnail: base64String }));
                setNewThumbnail(base64String);
                setThumbnailModalOpen(false);
              }
            }
          } catch (error) {
            console.error('Error updating thumbnail:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };
