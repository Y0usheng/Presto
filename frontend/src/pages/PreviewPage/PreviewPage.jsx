// src/pages/PreviewPage/PreviewPage.jsx
import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePresentation } from '../../hooks/usePresentation';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import {
  PreviewContainer, SlideWrapper, ControlBar, ControlBtn,
  SlideIndicator, TopActions, ActionPill
} from './PreviewPage.styles';

export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { slides, currentSlideIndex, loading, nextSlide, prevSlide } = usePresentation(id);

  const handleExit = useCallback((destination) => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }
    navigate(destination);
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        handleExit(`/presentation/${id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, handleExit, id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen().catch(err => console.log(err));
    }
  };

  const formatVideoUrl = (source, autoPlay) => {
    if (!autoPlay) return source;
    const separator = source.includes('?') ? '&' : '?';
    return `${source}${separator}autoplay=1&mute=1`;
  };

  if (loading) return <div style={{ backgroundColor: '#0e1318', height: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Presentation...</div>;

  const currentSlide = slides[currentSlideIndex];

  return (
    <PreviewContainer>
      <TopActions>
        <ActionPill onClick={() => handleExit('/dashboard')}>
          🏠 Dashboard
        </ActionPill>
        <ActionPill onClick={() => handleExit(`/presentation/${id}`)}>
          ✏️ Editor (Esc)
        </ActionPill>
      </TopActions>

      <SlideWrapper $bg={currentSlide?.background}>
        {currentSlide?.elements?.map((el, i) => {

          const baseStyle = {
            position: 'absolute',
            left: `${el.position?.x}%`,
            top: `${el.position?.y}%`,
            width: el.size ? `${el.size}%` : 'max-content',
            zIndex: el.layer || i,
          };

          if (el.type === 'text') {
            return (
              <div key={i} style={{ ...baseStyle, fontSize: `${el.fontSize * 2}cqw`, color: el.color, fontFamily: el.fontFamily, fontWeight: el.isBold ? 'bold' : 'normal', fontStyle: el.isItalic ? 'italic' : 'normal', whiteSpace: 'pre-wrap', lineHeight: '1.2' }}>
                {el.text}
              </div>
            );
          }
          if (el.type === 'image') {
            return <img key={i} src={el.source} alt={el.alt || ''} style={{ ...baseStyle, height: 'auto', display: 'block' }} />;
          }
          if (el.type === 'video') {
            return (
              <div key={i} style={{ ...baseStyle, aspectRatio: '16/9' }}>
                <iframe
                  src={formatVideoUrl(el.source, el.autoPlay)}
                  width="100%" height="100%" style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen title="video"
                />
              </div>
            );
          }
          if (el.type === 'code') {
            return (
              <div key={i} style={{ ...baseStyle }}>
                <SyntaxHighlighter
                  language={element.language || 'javascript'}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1.5cqw',
                    borderRadius: '0.8cqw',
                    fontSize: `${element.fontSize * 1.5}cqw`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {el.code}
                </SyntaxHighlighter>
              </div>
            );
          }
          return null;
        })}
      </SlideWrapper>

      <ControlBar>
        <ControlBtn onClick={prevSlide} disabled={currentSlideIndex === 0} title="Previous (Left Arrow)">◀</ControlBtn>
        <SlideIndicator>{currentSlideIndex + 1} / {slides.length}</SlideIndicator>
        <ControlBtn onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1} title="Next (Right Arrow)">▶</ControlBtn>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 10px' }}></div>

        <ControlBtn onClick={toggleFullscreen} title="Toggle Fullscreen" style={{ fontSize: '18px' }}>⛶</ControlBtn>
      </ControlBar>

    </PreviewContainer>
  );
}