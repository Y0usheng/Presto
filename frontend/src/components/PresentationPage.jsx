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

  const handleAddSlide = async () => {
    try {
      const newSlides = [...slides, { page: `Slide ${slides.length + 1}` }];
      setSlides(newSlides);

      const updatedPresentation = { ...presentation, slides: newSlides, slidesCount: newSlides.length };
      setPresentation(updatedPresentation);

      const response = await fetch(`http://localhost:5005/store`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const updatedStore = data.store.map((p) => (p.id === parseInt(id) ? updatedPresentation : p));

        const updateResponse = await fetch(`http://localhost:5005/store`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ ...data, store: updatedStore }),
        });

        if (updateResponse.ok) {
          setPresentation(updatedPresentation);
        } else {
          console.error('Failed to update presentation');
        }
      }
    } catch (error) {
      console.error('Error adding slide:', error);
    }
  };

  const handleDeleteSlide = async () => {
    if (slides.length === 1) {
      alert('Cannot delete the only slide. Please delete the presentation instead.');
      return;
    }

    const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(newSlides);

    const updatedPresentation = { ...presentation, slides: newSlides, slidesCount: newSlides.length };

    try {
      const response = await fetch(`http://localhost:5005/store`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const updatedStore = data.store.map((p) => (p.id === parseInt(id) ? updatedPresentation : p));

        const updateResponse = await fetch(`http://localhost:5005/store`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ ...data, store: updatedStore }),
        });

        if (updateResponse.ok) {
          setPresentation(updatedPresentation);
          if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
          }
        } else {
          console.error('Failed to update presentation');
        }
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  const handleSlideNavigation = (direction) => {
    if (direction === 'next' && currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (direction === 'prev' && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleAddTextElement = () => {
    setAddTextModalOpen(true);
  };

  const handleAddText = async () => {
    if (textContent.trim() === '') return;

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          elements: [
            ...(slide.elements || []),
            {
              type: 'text',
              size: textSize,
              text: textContent,
              fontSize: fontSize,
              color: textColor,
              position: textPosition,
              fontFamily: fontFamily,
              layer: (slide.elements || []).length,
            },
          ],
        }
        : slide
    );

    setSlides(updatedSlides);
    setAddTextModalOpen(false);
    resetTextFormFields();

    await updateStoreWithSlides(updatedSlides);
  };

  const handleEditText = async () => {
    if (textContent.trim() === '' || editElementIndex === null) return;

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el, idx) =>
            idx === editElementIndex
              ? {
                ...el,
                text: textContent,
                size: textSize,
                fontSize: fontSize,
                color: textColor,
                fontFamily: fontFamily,
                position: textPosition,
              }
              : el
          ),
        }
        : slide
    );

    setSlides(updatedSlides);
    setEditTextModalOpen(false);
    setEditElementIndex(null);
    resetTextFormFields();

    await updateStoreWithSlides(updatedSlides);
  };

  const updateStoreWithSlides = async (updatedSlides) => {
    try {
      const response = await fetch(`http://localhost:5005/store`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const updatedStore = data.store.map((p) => p.id === parseInt(id) ? { ...p, slides: updatedSlides } : p);

        const updateResponse = await fetch(`http://localhost:5005/store`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ ...data, store: updatedStore }),
        });

        if (!updateResponse.ok) {
          console.error('Failed to update presentation');
        }
      }
    } catch (error) {
      console.error('Error updating presentation:', error);
    }
  };

  const resetTextFormFields = () => {
    setTextContent('');
    setTextSize(50);
    setFontSize(1);
    setTextColor('#000000');
    setFontFamily('Arial');
    setTextPosition({ x: 0, y: 0 });
  };

  const handleAddImage = async () => {
    if (!imageSource.trim()) return;

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          elements: [
            ...(slide.elements || []),
            {
              type: 'image',
              size: imageSize,
              source: imageSource,
              alt: altText,
              position: imagePosition,
              layer: (slide.elements || []).length,
            },
          ],
        }
        : slide
    );

    setSlides(updatedSlides);
    setAddImageModalOpen(false);
    resetImageFormFields();

    await updateStoreWithSlides(updatedSlides);
  };

  const handleEditImage = async () => {
    if (!imageSource.trim() || editElementIndex === null) return;

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el, idx) =>
            idx === editElementIndex
              ? {
                ...el,
                source: imageSource,
                size: imageSize,
                alt: altText,
                position: imagePosition,
              }
              : el
          ),
        }
        : slide
    );

    setSlides(updatedSlides);
    setEditImageModalOpen(false);
    setEditElementIndex(null);
    resetImageFormFields();

    await updateStoreWithSlides(updatedSlides);
  };

  const resetImageFormFields = () => {
    setImageSource('');
    setImageSize(50);
    setAltText('');
    setImagePosition({ x: 0, y: 0 });
  };

  const handleAddVideo = async () => {
    if (!videoSource.trim()) return;

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          elements: [
            ...(slide.elements || []),
            {
              type: 'video',
              size: videoSize,
              source: videoSource,
              autoPlay: videoAutoPlay,
              position: { x: 0, y: 0 },
              layer: (slide.elements || []).length,
            },
          ],
        }
        : slide
    );

    setSlides(updatedSlides);
    setAddVideoModalOpen(false);
    resetVideoFormFields();

    await updateStoreWithSlides(updatedSlides);
  };

  const handleEditVideo = async () => {
    if (!videoSource.trim() || editElementIndex === null) return;

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el, idx) =>
            idx === editElementIndex
              ? {
                ...el,
                source: videoSource,
                size: videoSize,
                autoPlay: videoAutoPlay,
              }
              : el
          ),
        }
        : slide
    );

    setSlides(updatedSlides);
    setEditVideoModalOpen(false);
    setEditElementIndex(null);
    resetVideoFormFields();

    await updateStoreWithSlides(updatedSlides);
  };

  const resetVideoFormFields = () => {
    setVideoSource('');
    setVideoSize(50);
    setVideoAutoPlay(false);
  };

  const handleAddCodeElement = () => {
    setAddCodeModalOpen(true);
  };

  const handleAddCode = async () => {
    if (codeContent.trim() === '') return;

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          elements: [
            ...(slide.elements || []),
            {
              type: 'code',
              language: codeLanguage,
              code: codeContent,
              fontSize: codeFontSize,
              position: { x: 0, y: 0 },
              layer: (slide.elements || []).length,
            },
          ],
        }
        : slide
    );

    setSlides(updatedSlides);
    setAddCodeModalOpen(false);
    setCodeContent('');
    setCodeLanguage('javascript');
    setCodeFontSize(1);

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
          p.id === parseInt(id)
            ? { ...p, slides: updatedSlides }
            : p
        );

        const updateResponse = await fetch(`http://localhost:5005/store`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ ...data, store: updatedStore }),
        });

        if (!updateResponse.ok) {
          console.error('Failed to update presentation');
        }
      }
    } catch (error) {
      console.error('Error adding code:', error);
    }
  };

  const handleBackgroundChange = async () => {
    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
          ...slide,
          background: {
            type: backgroundType,
            color: backgroundColor,
            gradient: {
              direction: gradientDirection,
              start: gradientColors.start,
              end: gradientColors.end,
            },
            image: backgroundImage,
          },
        }
        : slide
    );

    setSlides(updatedSlides);
    setBackgroundModalOpen(false);
  };

  const getSlideBackgroundStyle = (slide) => {
    if (!slide?.background) {
      return '#ffffff';
    }
    if (slide.background.type === 'solid') {
      return slide.background.color;
    } else if (slide.background.type === 'gradient') {
      return `linear-gradient(${slide.background.gradient.direction}, ${slide.background.gradient.start}, ${slide.background.gradient.end})`;
    } else if (slide.background.type === 'image') {
      return `url(${slide.background.image})`;
    }
    return '#ffffff';
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" style={{ flexGrow: 1 }}>
            Slide title: {presentation?.name}
          </Typography>
          <Button color="inherit" onClick={() => localStorage.removeItem('token') && navigate('/login')}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <p>Slide description: {presentation?.description}</p>

      <Button variant="outlined" onClick={() => setThumbnailModalOpen(true)} style={{ marginLeft: '10px' }}>
        Update Thumbnail
      </Button>
      <Button variant="outlined" onClick={() => setEditTitleOpen(true)} style={{ marginLeft: '10px' }}>
        Edit Title
      </Button>
      <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '10px' }}>
        Delete Presentation
      </Button>
      <Button variant="outlined" onClick={handleAddSlide} style={{ marginLeft: '10px' }}>Add Slide</Button>
      <Button variant="outlined" color="error" onClick={handleDeleteSlide} style={{ marginLeft: '10px' }}>Delete Slide</Button>
      <br></br>
      <br></br>
      <br></br>
      <Button variant="outlined" onClick={handleAddTextElement} style={{ marginLeft: '10px' }}>Add Text Element</Button>
      <Button variant="outlined" onClick={() => setAddImageModalOpen(true)} style={{ marginLeft: '10px' }}>Add Image</Button>
      <Button variant="outlined" onClick={() => setAddVideoModalOpen(true)} style={{ marginLeft: '10px' }}>Add Video</Button>
      <Button variant="outlined" onClick={handleAddCodeElement} style={{ marginLeft: '10px' }}>Add Code Block</Button>
      <Button variant="outlined" onClick={() => setBackgroundModalOpen(true)} style={{ marginLeft: '10px' }}>Change Background</Button>
      <Button variant="outlined" onClick={() => window.open(`/preview/${id}`, '_blank')} style={{ marginLeft: '10px' }}> Preview</Button>

      {slides.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              disabled={currentSlideIndex === 0}
              onClick={() => handleSlideNavigation('prev')}
            >
              Previous
            </Button>
            <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
            <Button
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => handleSlideNavigation('next')}
            >
              Next
            </Button>
            <Typography variant="h4">{slides[currentSlideIndex]?.page}</Typography>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <SlideArea background={getSlideBackgroundStyle(slides[currentSlideIndex])}>
              <SlideNumber>{currentSlideIndex + 1}</SlideNumber>
              {slides[currentSlideIndex]?.elements?.map((element, index) => {
                if (element.type === 'text') {
                  return (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        top: `${element.position.y}%`,
                        left: `${element.position.x}%`,
                        width: `${element.size}%`,
                        border: '1px solid grey',
                        padding: '5px',
                        cursor: 'pointer',
                        fontFamily: element.fontFamily,
                      }}
                      onDoubleClick={() => {
                        setTextContent(element.text);
                        setTextSize(element.size);
                        setFontSize(element.fontSize);
                        setTextColor(element.color);
                        setFontFamily(element.fontFamily);
                        setTextPosition(element.position);
                        setEditElementIndex(index);
                        setEditTextModalOpen(true);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const updatedElements = slides[currentSlideIndex].elements.filter((_, i) => i !== index);
                        const updatedSlides = slides.map((slide, slideIndex) =>
                          slideIndex === currentSlideIndex ? { ...slide, elements: updatedElements } : slide
                        );
                        setSlides(updatedSlides);
                        updateStoreWithSlides(updatedSlides);
                      }}
                    >
                      <span style={{ fontSize: `${element.fontSize}em`, color: element.color }}>
                        {element.text}
                      </span>
                    </div>
                  );
                } else if (element.type === 'image') {
                  return (
                    <img
                      key={index}
                      src={element.source}
                      alt={element.alt}
                      style={{
                        position: 'absolute',
                        top: `${element.position.y}%`,
                        left: `${element.position.x}%`,
                        width: `${element.size}%`,
                        cursor: 'pointer',
                        border: '1px solid grey',
                      }}
                      onDoubleClick={() => {
                        setImageSource(element.source);
                        setImageSize(element.size);
                        setAltText(element.alt);
                        setImagePosition(element.position);
                        setEditElementIndex(index);
                        setEditImageModalOpen(true);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const updatedElements = slides[currentSlideIndex].elements.filter((_, i) => i !== index);
                        const updatedSlides = slides.map((slide, slideIndex) =>
                          slideIndex === currentSlideIndex ? { ...slide, elements: updatedElements } : slide
                        );
                        setSlides(updatedSlides);
                        updateStoreWithSlides(updatedSlides);
                      }}
                    />
                  );
                } else if (element.type === 'video') {
                  return (
                    <VideoWrapper
                      key={index}
                      size={element.size}
                      position={element.position}
                      onDoubleClick={() => {
                        setVideoSource(element.source);
                        setVideoSize(element.size);
                        setVideoAutoPlay(element.autoPlay);
                        setEditElementIndex(index);
                        setEditVideoModalOpen(true);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const updatedElements = slides[currentSlideIndex].elements.filter((_, i) => i !== index);
                        const updatedSlides = slides.map((slide, slideIndex) =>
                          slideIndex === currentSlideIndex ? { ...slide, elements: updatedElements } : slide
                        );
                        setSlides(updatedSlides);
                      }}
                    >
                      <iframe src={element.source} width="100%" height="auto" autoPlay={element.autoPlay} />
                    </VideoWrapper>
                  );
                } else if (element.type === 'code') {
                  let languageIcon;
                  let languageName;

                  switch (element.language) {
                  case 'javascript':
                    languageIcon = <SiJavascript color="#F0DB4F" size={24} />;
                    languageName = "JavaScript";
                    break;
                  case 'python':
                    languageIcon = <SiPython color="#306998" size={24} />;
                    languageName = "Python";
                    break;
                  case 'c':
                    languageIcon = <SiC color="#00599C" size={24} />;
                    languageName = "C";
                    break;
                  default:
                    languageName = element.language;
                    break;
                  }

                  return (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        top: `${element.position.y}%`,
                        left: `${element.position.x}%`,
                        width: '80%',
                        border: '1px solid grey',
                        padding: '10px',
                        cursor: 'pointer',
                        backgroundColor: '#f5f5f5',
                        overflow: 'auto'
                      }}
                      onDoubleClick={() => {
                        setCodeContent(element.code);
                        setCodeLanguage(element.language);
                        setCodeFontSize(element.fontSize);
                        setAddCodeModalOpen(true);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const updatedElements = slides[currentSlideIndex].elements.filter((_, i) => i !== index);
                        const updatedSlides = slides.map((slide, slideIndex) =>
                          slideIndex === currentSlideIndex ? { ...slide, elements: updatedElements } : slide
                        );
                        setSlides(updatedSlides);
                        updateStoreWithSlides(updatedSlides);
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                        backgroundColor: '#e0e0e0',
                        padding: '5px',
                        borderRadius: '6px 6px 0 0',
                      }}>
                        {languageIcon}
                        <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{languageName}</span>
                      </div>

                      <SyntaxHighlighter
                        language={element.language}
                        style={docco}
                        customStyle={{ fontSize: `${element.fontSize}em`, whiteSpace: 'pre-wrap' }}
                      >
                        {element.code}
                      </SyntaxHighlighter>
                    </div>
                  );
                }
                return null;
              })}
            </SlideArea>
          </div>
        </div>
      )}

      <Modal open={editTitleOpen} onClose={() => setEditTitleOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
          <h2>Edit Presentation Title</h2>
          <TextField fullWidth label="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} margin="normal" />
          <Button variant="contained" onClick={handleTitleEdit}>Save </Button>
        </Box>
      </Modal>

      <Modal open={thumbnailModalOpen} onClose={() => setThumbnailModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
          <Typography variant="h6" mb={2}>
            Upload New Thumbnail
          </Typography>
          <input type="file" onChange={handleThumbnailUpdate} />
        </Box>
      </Modal>

      <Modal open={addTextModalOpen} onClose={() => setAddTextModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Add Text Element</Typography>
          <TextField fullWidth label="Text Content" value={textContent} onChange={(e) => setTextContent(e.target.value)} margin="normal" />
          <TextField fullWidth label="Size (%)" type="number" value={textSize} onChange={(e) => setTextSize(e.target.value)} margin="normal" />
          <TextField fullWidth label="Font Size (em)" type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} margin="normal" />
          <TextField fullWidth label="Text Color" type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} margin="normal" />
          <InputLabel id="font-family-label">Font Family</InputLabel>
          <Select
            labelId="font-family-label"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
          </Select>
          <TextField fullWidth label="Position X (%)" type="number" value={textPosition.x} onChange={(e) => setTextPosition({ ...textPosition, x: e.target.value })} margin="normal" />
          <TextField fullWidth label="Position Y (%)" type="number" value={textPosition.y} onChange={(e) => setTextPosition({ ...textPosition, y: e.target.value })} margin="normal" />
          <Button variant="contained" onClick={handleAddText} style={{ marginTop: '20px' }}>Add Text</Button>
        </Box>
      </Modal>

      <Modal open={editTextModalOpen} onClose={() => setEditTextModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Edit Text Element</Typography>
          <TextField fullWidth label="Text Content" value={textContent} onChange={(e) => setTextContent(e.target.value)} margin="normal" />
          <TextField fullWidth label="Size (%)" type="number" value={textSize} onChange={(e) => setTextSize(e.target.value)} margin="normal" />
          <TextField fullWidth label="Font Size (em)" type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} margin="normal" />
          <TextField fullWidth label="Text Color" type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} margin="normal" />
          <InputLabel id="font-family-label">Font Family</InputLabel>
          <Select
            labelId="font-family-label"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
          </Select>
          <TextField fullWidth label="Position X (%)" type="number" value={textPosition.x} onChange={(e) => setTextPosition({ ...textPosition, x: e.target.value })} margin="normal" />
          <TextField fullWidth label="Position Y (%)" type="number" value={textPosition.y} onChange={(e) => setTextPosition({ ...textPosition, y: e.target.value })} margin="normal" />
          <Button variant="contained" onClick={handleEditText} style={{ marginTop: '20px' }}>Save Changes</Button>
        </Box>
      </Modal>

      <Modal open={addImageModalOpen} onClose={() => setAddImageModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Add Image</Typography>
          <TextField fullWidth label="Image URL" value={imageSource} onChange={(e) => setImageSource(e.target.value)} margin="normal" />
          <input type="file" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageSource(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }} />
          <TextField fullWidth label="Size (%)" type="number" value={imageSize} onChange={(e) => setImageSize(e.target.value)} margin="normal" />
          <TextField fullWidth label="Alt Text" value={altText} onChange={(e) => setAltText(e.target.value)} margin="normal" />
          <TextField fullWidth label="Position X (%)" type="number" value={imagePosition.x} onChange={(e) => setImagePosition({ ...imagePosition, x: e.target.value })} margin="normal" />
          <TextField fullWidth label="Position Y (%)" type="number" value={imagePosition.y} onChange={(e) => setImagePosition({ ...imagePosition, y: e.target.value })} margin="normal" />
          <Button variant="contained" onClick={handleAddImage} style={{ marginTop: '20px' }}>Add Image</Button>
        </Box>
      </Modal>

      <Modal open={editImageModalOpen} onClose={() => setEditImageModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Edit Image</Typography>
          <TextField fullWidth label="Image URL" value={imageSource} onChange={(e) => setImageSource(e.target.value)} margin="normal" />
          <input type="file" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageSource(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }} />
          <TextField fullWidth label="Size (%)" type="number" value={imageSize} onChange={(e) => setImageSize(e.target.value)} margin="normal" />
          <TextField fullWidth label="Alt Text" value={altText} onChange={(e) => setAltText(e.target.value)} margin="normal" />
          <TextField fullWidth label="Position X (%)" type="number" value={imagePosition.x} onChange={(e) => setImagePosition({ ...imagePosition, x: e.target.value })} margin="normal" />
          <TextField fullWidth label="Position Y (%)" type="number" value={imagePosition.y} onChange={(e) => setImagePosition({ ...imagePosition, y: e.target.value })} margin="normal" />
          <Button variant="contained" onClick={handleEditImage} style={{ marginTop: '20px' }}>Save Changes</Button>
        </Box>
      </Modal>

      <Modal open={addVideoModalOpen} onClose={() => setAddVideoModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Add Video</Typography>
          <TextField fullWidth label="Video URL" value={videoSource} onChange={(e) => setVideoSource(e.target.value)} margin="normal" />
          <TextField fullWidth label="Size (%)" type="number" value={videoSize} onChange={(e) => setVideoSize(e.target.value)} margin="normal" />
          <FormControlLabel
            control={<Checkbox checked={videoAutoPlay} onChange={(e) => setVideoAutoPlay(e.target.checked)} />}
            label="Auto-Play"
          />
          <Button variant="contained" onClick={handleAddVideo} style={{ marginTop: '20px' }}>Add Video</Button>
        </Box>
      </Modal>

      <Modal open={editVideoModalOpen} onClose={() => setEditVideoModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Edit Video</Typography>
          <TextField fullWidth label="Video URL" value={videoSource} onChange={(e) => setVideoSource(e.target.value)} margin="normal" />
          <TextField fullWidth label="Size (%)" type="number" value={videoSize} onChange={(e) => setVideoSize(e.target.value)} margin="normal" />
          <FormControlLabel
            control={<Checkbox checked={videoAutoPlay} onChange={(e) => setVideoAutoPlay(e.target.checked)} />}
            label="Auto-Play"
          />
          <Button variant="contained" onClick={handleEditVideo} style={{ marginTop: '20px' }}>Save Changes</Button>
        </Box>
      </Modal>

      <Modal open={addCodeModalOpen} onClose={() => setAddCodeModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
          <Typography variant="h6" gutterBottom>
            Add Code Block
          </Typography>
          <InputLabel id="language-label">Language</InputLabel>
          <Select labelId="language-label" value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)} fullWidth margin="dense" >
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C</MenuItem>
          </Select>
          <TextField fullWidth label="Code Content" value={codeContent} onChange={(e) => setCodeContent(e.target.value)} margin="dense" multiline rows={6} />
          <TextField fullWidth label="Font Size (em)" type="number" value={codeFontSize} onChange={(e) => setCodeFontSize(e.target.value)} margin="dense" />
          <Button variant="contained" onClick={handleAddCode} style={{ marginTop: '20px' }}> Add Code</Button>
        </Box>
      </Modal>

      <Modal open={backgroundModalOpen} onClose={() => setBackgroundModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Change Background</Typography>

          <InputLabel id="background-type-label">Background Type</InputLabel>
          <Select
            labelId="background-type-label"
            value={backgroundType}
            onChange={(e) => setBackgroundType(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="solid">Solid Color</MenuItem>
            <MenuItem value="gradient">Gradient</MenuItem>
            <MenuItem value="image">Image</MenuItem>
          </Select>

          {backgroundType === 'solid' && (
            <TextField
              fullWidth
              label="Background Color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              margin="normal"
            />
          )}

          {backgroundType === 'gradient' && (
            <>
              <InputLabel id="gradient-direction-label">Gradient Direction</InputLabel>
              <Select
                labelId="gradient-direction-label"
                value={gradientDirection}
                onChange={(e) => setGradientDirection(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="to right">Left to Right</MenuItem>
                <MenuItem value="to bottom">Top to Bottom</MenuItem>
              </Select>
              <TextField
                fullWidth
                label="Start Color"
                type="color"
                value={gradientColors.start}
                onChange={(e) => setGradientColors({ ...gradientColors, start: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="End Color"
                type="color"
                value={gradientColors.end}
                onChange={(e) => setGradientColors({ ...gradientColors, end: e.target.value })}
                margin="normal"
              />
            </>
          )}

          {backgroundType === 'image' && (
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setBackgroundImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          )}

          <Button variant="contained" onClick={handleBackgroundChange} style={{ marginTop: '20px' }}>Apply Background</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default PresentationPage;