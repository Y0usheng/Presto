import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';
import { api } from '../../utils/api';

const FullScreenSlide = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: ${(props) => props.background};
`;

const SlideContent = styled.div`
    width: 80%;
    height: 80%;
    position: relative;
`;

function PreviewPage() {
  const { id, slideNumber } = useParams();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const data = await api.getStore();
        const foundPresentation = data.store.find(p => p.id === parseInt(id));

        if (foundPresentation) {
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

  useEffect(() => {
    navigate(`/preview/${id}/slide/${currentSlideIndex + 1}`, { replace: true });
  }, [currentSlideIndex, id, navigate]);

  useEffect(() => {
    if (slideNumber) {
      setCurrentSlideIndex(parseInt(slideNumber) - 1);
    }
  }, [slideNumber]);

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

  const handleSlideNavigation = (direction) => {
    if (direction === 'next' && currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (direction === 'prev' && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <FullScreenSlide background={getSlideBackgroundStyle(slides[currentSlideIndex])}>
      <SlideContent>
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
                  color: element.color,
                  fontSize: `${element.fontSize}em`,
                }}
              >
                {element.text}
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
                }}
              />
            );
          } else if (element.type === 'video') {
            return (
              <video
                key={index}
                src={element.source}
                width={`${element.size}%`}
                style={{
                  position: 'absolute',
                  top: `${element.position.y}%`,
                  left: `${element.position.x}%`,
                }}
                controls
                autoPlay={element.autoPlay}
              />
            );
          } else if (element.type === 'code') {
            return (
              <pre
                key={index}
                style={{
                  position: 'absolute',
                  top: `${element.position.y}%`,
                  left: `${element.position.x}%`,
                  width: '80%',
                  fontSize: `${element.fontSize}em`,
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                }}
              >
                <code>{element.code}</code>
              </pre>
            );
          }
          return null;
        })}
      </SlideContent>

      <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '20px' }}>
        <Button
          disabled={currentSlideIndex === 0}
          onClick={() => handleSlideNavigation('prev')}
        >
          Previous
        </Button>
        <Typography>Slide {currentSlideIndex + 1} of {slides.length}</Typography>
        <Button
          disabled={currentSlideIndex === slides.length - 1}
          onClick={() => handleSlideNavigation('next')}
        >
          Next
        </Button>
      </div>
    </FullScreenSlide>
  );
}

export default PreviewPage;
