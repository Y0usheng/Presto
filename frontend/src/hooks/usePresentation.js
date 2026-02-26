import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function usePresentation(id) {
    const [presentation, setPresentation] = useState(null);
    const [slides, setSlides] = useState([{ elements: [] }]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [bgModalOpen, setBgModalOpen] = useState(false);

    // 初始化获取数据
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
                }
            } catch (error) {
                console.error('Error fetching presentation:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPresentation();
    }, [id]);

    // 统一的更新服务器方法
    const updateStoreWithSlides = async (updatedSlides, newTitle = title) => {
        try {
            const data = await api.getStore();
            const storeData = data.store;
            const list = Array.isArray(storeData) ? storeData : (storeData?.presentations || []);

            const updatedStore = list.map(p =>
                p.id === parseInt(id) ? { ...p, slides: updatedSlides, title: newTitle } : p
            );
            await api.updateStore(updatedStore);
        } catch (error) {
            console.error('Error updating store:', error);
        }
    };

    // 基础操作方法封装
    const handleTitleChange = (newTitle) => {
        setTitle(newTitle);
        updateStoreWithSlides(slides, newTitle);
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

    const handleSaveBackground = async (newBackground) => {
        const updatedSlides = slides.map((slide, index) => {
            // 只有当前正在编辑的幻灯片才修改背景
            if (index !== currentSlideIndex) return slide;
            return { ...slide, background: newBackground };
        });

        setSlides(updatedSlides);
        await updateStoreWithSlides(updatedSlides);
    };

    return {
        presentation,
        slides,
        setSlides,
        currentSlideIndex,
        title,
        loading,
        updateStoreWithSlides,
        handleTitleChange,
        addSlide,
        deleteSlide,
        nextSlide,
        prevSlide,
        handleSaveBackground,
        bgModalOpen,
        setBgModalOpen
    };
}