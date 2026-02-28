// src/hooks/usePresentation.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export function usePresentation(id) {
    const [presentation, setPresentation] = useState(null);
    const [slides, setSlides] = useState([{ elements: [] }]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(true);
    const [past, setPast] = useState([]);
    const [future, setFuture] = useState([]);

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
                    setPast([]);
                    setFuture([]);
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

    const saveSlides = useCallback(async (newSlides) => {
        setPast(prev => [...prev, slides]);
        setFuture([]);
        setSlides(newSlides);
        await updateStoreWithSlides(newSlides);
    }, [slides, title, thumbnail, id]);

    const undo = useCallback(async () => {
        if (past.length === 0) return;
        const previousSlides = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        setFuture(prev => [slides, ...prev]);
        setPast(newPast);
        setSlides(previousSlides);
        await updateStoreWithSlides(previousSlides);
    }, [past, slides, title, thumbnail, id]);

    const redo = useCallback(async () => {
        if (future.length === 0) return;
        const nextSlides = future[0];
        const newFuture = future.slice(1);

        setPast(prev => [...prev, slides]);
        setFuture(newFuture);
        setSlides(nextSlides);
        await updateStoreWithSlides(nextSlides);
    }, [future, slides, title, thumbnail, id]);

    const handleTitleChange = (newTitle) => {
        setTitle(newTitle);
        updateStoreWithSlides(slides, newTitle, thumbnail);
    };

    const addSlide = () => {
        const newSlides = [...slides, { elements: [] }];
        setCurrentSlideIndex(newSlides.length - 1);
        saveSlides(newSlides);
    };

    const deleteSlide = () => {
        if (slides.length <= 1) {
            alert("Cannot delete the last slide!");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this slide?");
        if (confirmDelete) {
            const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
            setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
            saveSlides(newSlides);
        }
    };

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(currentSlideIndex + 1);
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) setCurrentSlideIndex(currentSlideIndex - 1);
    };

    return {
        presentation, slides, currentSlideIndex, title, thumbnail, loading,
        handleTitleChange, addSlide, deleteSlide, nextSlide, prevSlide,
        saveSlides, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 // 👈 暴露出强大的历史 API
    };
}