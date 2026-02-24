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
import { api } from '../utils/api';
import TextModal from './TextModal';
import ImageModal from './ImageModal';
import VideoModal from './VideoModal';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);

const SlideArea = styled.div`
  width:90vw;
  height: 90vh;
  max-width: 1000px;  
  max-height: 800px;
  border: 1px solid #ccc;
  position: relative;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.background};

  @media (max-width: 768px) {
    max-width: 500px;  
    max-height: 300px;
  }

  @media (max-width: 480px) {
    max-width: 400px;  
    max-height: 250px;
  }
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

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 0.9em;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 0.8em;
  }
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

  @media (max-width: 768px) {
    width: ${(props) => props.size * 0.9}%;
  }

  @media (max-width: 480px) {
    width: ${(props) => props.size * 0.8}%;
  }
`;

const Editing = styled.p`
  margin-top: 20px;
  margin-left: 10px;
  font-size: 1.5rem;
  color: #5a5a5a;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
`;

const Description = styled.p`
  margin-left: 10px;
  margin-button: 30px;
  font-size: 1.7rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const Slide = styled.p`
  margin-top: 20px;
  margin-left: 10px;
  font-size: 1.5rem;
  color: #5a5a5a;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
`;

const AddIn = styled.p`
  margin-top: 20px;
  margin-left: 10px;
  font-size: 1.5rem;
  color: #5a5a5a;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
`;

function PresentationPage() {
  const { id, slideNumber } = useParams();
  const navigate = useNavigate();

  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [setNewThumbnail] = useState(null);

  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(parseInt(slideNumber) - 1 || 0);
  const [presentation, setPresentation] = useState(null);

  const [editElementIndex, setEditElementIndex] = useState(null);

  const [textModalConfig, setTextModalConfig] = useState({ isOpen: false, initialData: null, editIndex: null });

  const [imageModalConfig, setImageModalConfig] = useState({ isOpen: false, initialData: null, editIndex: null });

  const [videoModalConfig, setVideoModalConfig] = useState({ isOpen: false, initialData: null, editIndex: null });

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

  // 2.2.3. Basics of a presentation controls, Delete Presentation
  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        const data = await api.getStore();
        let updatedStore = data.store.filter(p => p.id !== parseInt(id));
        updatedStore = updatedStore.map((presentation, index) => ({
          ...presentation,
          id: index + 1,
        }));

        await api.updateStore(updatedStore);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting presentation:', error);
      }
    }
  };

  // Gain the list of the presentation
  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const data = await api.getStore();
        const foundPresentation = data.store.find(p => p.id === parseInt(id));
        if (foundPresentation) {
          setPresentation(foundPresentation);
          setNewTitle(foundPresentation.name);
          setSlides(foundPresentation.slides || []);
        } else {
          console.error('Presentation not found');
        }
      } catch (error) {
        console.error('Error fetching presentation:', error);
      }
    };

    fetchPresentation();
  }, [id]);

  // 2.4.4. URL Updating
  useEffect(() => {
    navigate(`/presentation/${id}/slide/${currentSlideIndex + 1}`, { replace: true });
  }, [currentSlideIndex, id, navigate]);

  useEffect(() => {
    if (slideNumber) {
      setCurrentSlideIndex(parseInt(slideNumber) - 1);
    }
  }, [slideNumber]);

  // 2.2.4. Title editing
  const handleTitleEdit = async () => {
    try {
      const data = await api.getStore();
      const updatedStore = data.store.map((p) =>
        p.id === parseInt(id) ? { ...p, name: newTitle } : p
      );
      const updateResponse = await api.updateStore(updatedStore);
      if (updateResponse.ok) {
        setPresentation((prev) => ({ ...prev, name: newTitle }));
        setEditTitleOpen(false);
      }
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  // 2.2.4. Thumbnail editing
  const handleThumbnailUpdate = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        if (window.confirm('Are you sure you want to change the thumbnail?')) {
          try {
            const data = await api.getStore();
            const updatedStore = data.store.map((p) =>
              p.id === parseInt(id) ? { ...p, thumbnail: base64String } : p
            );
            const updateResponse = await api.updateStore(updatedStore);
            if (updateResponse.ok) {
              setPresentation((prev) => ({ ...prev, thumbnail: base64String }));
              setNewThumbnail(base64String);
              setThumbnailModalOpen(false);
            }
          } catch (error) {
            console.error('Error updating thumbnail:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 2.2.5. Creating slides
  const handleAddSlide = async () => {
    try {
      const newSlides = [...slides, { page: `Slide ${slides.length + 1}` }];
      setSlides(newSlides);
      const updatedPresentation = { ...presentation, slides: newSlides, slidesCount: newSlides.length };
      setPresentation(updatedPresentation);
      const data = await api.getStore();
      const updatedStore = data.store.map((p) => (p.id === parseInt(id) ? updatedPresentation : p));
      const updateResponse = await api.updateStore(updatedStore);
      if (updateResponse.ok) {
        setPresentation(updatedPresentation);
      } else {
        console.error('Failed to update presentation');
      }
    } catch (error) {
      console.error('Error adding slide:', error);
    }
  };

  // 2.2.6.Deleting slides
  const handleDeleteSlide = async () => {
    if (slides.length === 1) {
      alert('Cannot delete the only slide. Please delete the presentation instead.');
      return;
    }

    const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(newSlides);

    const updatedPresentation = { ...presentation, slides: newSlides, slidesCount: newSlides.length };

    try {
      const data = await api.getStore();
      const updatedStore = data.store.map((p) => (p.id === parseInt(id) ? updatedPresentation : p));
      const updateResponse = await api.updateStore(updatedStore);
      if (updateResponse.ok) {
        setPresentation(updatedPresentation);
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex(currentSlideIndex - 1);
        }
      } else {
        console.error('Failed to update presentation');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  // 2.2.5. Moving between
  const handleSlideNavigation = (direction) => {
    if (direction === 'next' && currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (direction === 'prev' && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // 2.3.1. Putting TEXT on the slide
  const handleAddTextElement = () => {
    setAddTextModalOpen(true);
  };

  const updateStoreWithSlides = async (updatedSlides) => {
    try {
      const data = await api.getStore();
      const updatedStore = data.store.map((p) => p.id === parseInt(id) ? { ...p, slides: updatedSlides } : p);
      const updateResponse = await api.updateStore(updatedStore);
      if (!updateResponse.ok) {
        console.error('Failed to update presentation');
      }
    } catch (error) {
      console.error('Error updating presentation:', error);
    }
  };

  const handleSaveTextElement = async (textElementData) => {
    const isEditing = textModalConfig.editIndex !== null;

    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;

      const newElements = [...(slide.elements || [])];
      if (isEditing) {
        // 修改现有元素
        newElements[textModalConfig.editIndex] = { ...newElements[textModalConfig.editIndex], ...textElementData };
      } else {
        // 添加新元素，加上 layer 属性
        newElements.push({ ...textElementData, layer: newElements.length });
      }
      return { ...slide, elements: newElements };
    });

    setSlides(updatedSlides);
    await updateStoreWithSlides(updatedSlides);
  };

  // 2.3.2. Putting an IMAGE on the slide
  const handleSaveImageElement = async (imageElementData) => {
    const isEditing = imageModalConfig.editIndex !== null;

    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;

      const newElements = [...(slide.elements || [])];
      if (isEditing) {
        newElements[imageModalConfig.editIndex] = { ...newElements[imageModalConfig.editIndex], ...imageElementData };
      } else {
        newElements.push({ ...imageElementData, layer: newElements.length });
      }
      return { ...slide, elements: newElements };
    });

    setSlides(updatedSlides);
    await updateStoreWithSlides(updatedSlides);
  };

  // 2.3.3. Putting a VIDEO on the slide
  const handleSaveVideoElement = async (videoElementData) => {
    const isEditing = videoModalConfig.editIndex !== null;

    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;

      const newElements = [...(slide.elements || [])];
      if (isEditing) {
        newElements[videoModalConfig.editIndex] = { ...newElements[videoModalConfig.editIndex], ...videoElementData };
      } else {
        newElements.push({ ...videoElementData, layer: newElements.length });
      }
      return { ...slide, elements: newElements };
    });

    setSlides(updatedSlides);
    await updateStoreWithSlides(updatedSlides);
  };

  // 2.3.4. Putting CODE on the slide
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
      const data = await api.getStore();
      const updatedStore = data.store.map((p) =>
        p.id === parseInt(id)
          ? { ...p, slides: updatedSlides }
          : p
      );

      const updateResponse = await api.updateStore(updatedStore);
      if (!updateResponse.ok) {
        console.error('Failed to update presentation');
      }
    } catch (error) {
      console.error('Error adding code:', error);
    }
  };

  // 2.4.2. Theme and background picker
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

      <Description>Slide description: {presentation?.description}</Description>

      {/* All button implemented */}
      <Editing>Editing:</Editing>
      <Button variant="outlined" onClick={() => setThumbnailModalOpen(true)} style={{ marginLeft: '10px' }}>
        Update Thumbnail
      </Button>
      <Button variant="outlined" onClick={() => setEditTitleOpen(true)} style={{ marginLeft: '10px' }}>
        Edit Title
      </Button>
      <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '10px' }}>
        Delete Presentation
      </Button>

      <Slide>Slide Change:</Slide>
      <Button variant="outlined" onClick={handleAddSlide} style={{ marginLeft: '10px' }}>Add Slide</Button>
      <Button variant="outlined" color="error" onClick={handleDeleteSlide} style={{ marginLeft: '10px' }}>Delete Slide</Button>

      <AddIn>Add in Slide:</AddIn>
      <Button variant="outlined" onClick={() => setTextModalConfig({ isOpen: true, initialData: null, editIndex: null })} style={{ marginLeft: '10px' }}>Add Text Element</Button>
      <Button variant="outlined" onClick={() => setImageModalConfig({ isOpen: true, initialData: null, editIndex: null })} style={{ marginLeft: '10px' }}>Add Image</Button>
      <Button variant="outlined" onClick={() => setVideoModalConfig({ isOpen: true, initialData: null, editIndex: null })} style={{ marginLeft: '10px' }}>Add Video</Button>      <Button variant="outlined" onClick={handleAddCodeElement} style={{ marginLeft: '10px' }}>Add Code Block</Button>
      <Button variant="outlined" onClick={() => setBackgroundModalOpen(true)} style={{ marginLeft: '10px' }}>Change Background</Button>
      <Button variant="outlined" onClick={() => window.open(`/preview/${id}`, '_blank')} style={{ marginLeft: '10px' }}> Preview</Button>

      {/* 2.2.5. Moving between */}
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
                //////////////////////////////////////
                // 2.3.1. Putting TEXT on the slide //
                //////////////////////////////////////
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
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                      onDoubleClick={() => {
                        setTextModalConfig({
                          isOpen: true,
                          initialData: element,
                          editIndex: index
                        });
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
                  //////////////////////////////////////////
                  // 2.3.2. Putting an IMAGE on the slide //
                  //////////////////////////////////////////
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
                        setImageModalConfig({
                          isOpen: true,
                          initialData: element,
                          editIndex: index
                        });
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

                  /////////////////////////////////////////
                  // 2.3.3. Putting a VIDEO on the slide //
                  /////////////////////////////////////////
                } else if (element.type === 'video') {
                  return (
                    <VideoWrapper
                      key={index}
                      size={element.size}
                      position={element.position}
                      onDoubleClick={() => {
                        setVideoModalConfig({
                          isOpen: true,
                          initialData: element,
                          editIndex: index
                        });
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

                  /////////////////////////////////////////
                  // 2.3.4. Putting CODE on the slide //
                  /////////////////////////////////////////
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
                        overflow: 'auto',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
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

      {/* Model for 2.2.4. Title editing */}
      <Modal open={editTitleOpen} onClose={() => setEditTitleOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
          <h2>Edit Presentation Title</h2>
          <TextField fullWidth label="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} margin="normal" />
          <Button variant="contained" onClick={handleTitleEdit}>Save </Button>
        </Box>
      </Modal>

      {/* Model for 2.2.4. Thumbnail editing */}
      <Modal open={thumbnailModalOpen} onClose={() => setThumbnailModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
          <Typography variant="h6" mb={2}>
            Upload New Thumbnail
          </Typography>
          <input type="file" onChange={handleThumbnailUpdate} />
        </Box>
      </Modal>

      {/* Model for 2.3.1. Putting an Text on the slide */}
      <TextModal
        open={textModalConfig.isOpen}
        onClose={() => setTextModalConfig({ ...textModalConfig, isOpen: false })}
        onSave={handleSaveTextElement}
        initialData={textModalConfig.initialData}
      />

      {/* Model for 2.3.2. Putting an IMAGE on the slide */}
      <ImageModal
        open={imageModalConfig.isOpen}
        onClose={() => setImageModalConfig({ ...imageModalConfig, isOpen: false })}
        onSave={handleSaveImageElement}
        initialData={imageModalConfig.initialData}
      />

      {/* Model for 2.3.3. Putting a VIDEO on the slide */}
      <VideoModal
        open={videoModalConfig.isOpen}
        onClose={() => setVideoModalConfig({ ...videoModalConfig, isOpen: false })}
        onSave={handleSaveVideoElement}
        initialData={videoModalConfig.initialData}
      />

      {/* Model for 2.3.4. Putting CODE on the slide */}
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

      {/* Model for 2.4.2. Theme and background picker */}
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