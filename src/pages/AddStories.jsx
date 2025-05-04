import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AddStories = () => {
    const user = useSelector((state) => state.user.user._id);
    const token = useSelector((state) => state.user.token);

    const [formData, setFormData] = useState({
        author: user,
        description: '',
        media: null,
        type: 'video', // Default to 'video', will update dynamically
        hashtags: [],
        isPublic: true, // Default to true as per API screenshot
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type.startsWith('video') ? 'video' : 'image';
            setFormData({
                ...formData,
                media: file,
                type: fileType, // Dynamically set type based on file
            });
        }
    };

    const handleHashtagChange = (e) => {
        const hashtags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setFormData({ ...formData, hashtags });
    };

    const handleSubmit = async () => {
        const data = new FormData();
        data.append('author', formData.author);
        data.append('description', formData.description);
        if (formData.media) {
            data.append('media', formData.media);
        }
        data.append('type', formData.type);
        data.append('hashtags', JSON.stringify(formData.hashtags));
        data.append('isPublic', formData.isPublic);

        try {
            const response = await fetch('https://backend-mars-hub.onrender.com/api/v1/reels', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token for auth
                },
                body: data,
            });

            const result = await response.json();
            console.log('Uploaded:', result);
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    return (
        <div className='flex-1 p-4 space-y-4'>
            <input
                type='text'
                placeholder='Author'
                className='input input-bordered w-full'
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            <input
                type='text'
                placeholder='Description'
                className='input input-bordered w-full'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
                type='file'
                accept='video/*,image/*'
                className='file-input file-input-bordered w-full'
                onChange={handleFileChange}
            />
            <input
                type='text'
                placeholder='Hashtags (comma-separated)'
                className='input input-bordered w-full'
                onChange={handleHashtagChange}
            />
            <label className='flex items-center space-x-2'>
                <input
                    type='checkbox'
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                />
                <span>Public</span>
            </label>
            <button className='btn btn-primary w-full' onClick={handleSubmit}>
                Upload Story
            </button>
        </div>
    );
};

export default AddStories;