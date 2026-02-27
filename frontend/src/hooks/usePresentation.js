// src/hooks/usePresentation.js
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function usePresentation(id) {
    const [presentation, setPresentation] = useState(null);
    const [slides, setSlides] = useState([{ elements: [] }]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPresentation = async () => {
            try {
                const data = await api.getStore();
                const storeData = data.store;
                const list = Array.isArray(storeData) ? storeData : (storeData?.presentations || []);
                const found = list.find(p => p.id === parseInt(id));

                if (found) {
                    setPresentation(found);
                    setSlides(found.slides || [{ elements: [] }]);
                    setTitle(found.title || 'Untitled Design');
                    setThumbnail(found.thumbnail || '');
                }
            } catch (error) {
                console.error('Error fetching presentation:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPresentation();
    }, [id]);

    const updateStoreWithSlides = async (updatedSlides, newTitle = title, newThumbnail = thumbnail) => {
        try {
            const data = await api.getStore();
            const storeData = data.store;
            const list = Array.isArray(storeData) ? storeData : (storeData?.presentations || []);

            const updatedStore = list.map(p =>
                p.id === parseInt(id) ? { ...p, slides: updatedSlides, title: newTitle, thumbnail: newThumbnail } : p
            );
            await api.updateStore(updatedStore);
            setThumbnail(newThumbnail);
        } catch (error) {
            console.error('Error updating store:', error);
        }
    };

    const handleTitleChange = (newTitle) => {
        setTitle(newTitle);
        updateStoreWithSlides(slides, newTitle, thumbnail);
    };

    const addSlide = () => {
        const newSlides = [...slides, { elements: [] }];
        setSlides(newSlides);
        setCurrentSlideIndex(newSlides.length - 1);
        updateStoreWithSlides(newSlides);
    };

    const deleteSlide = () => {
        if (slides.length <= 1) {
            alert("Cannot delete the last slide!");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this slide?");
        if (confirmDelete) {
            const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
            setSlides(newSlides);
            setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
            updateStoreWithSlides(newSlides);
        }
    };

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(currentSlideIndex + 1);
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) setCurrentSlideIndex(currentSlideIndex - 1);
    };

    return {
        presentation, slides, setSlides, currentSlideIndex, title, thumbnail, loading,
        updateStoreWithSlides, handleTitleChange, addSlide, deleteSlide, nextSlide, prevSlide
    };
}