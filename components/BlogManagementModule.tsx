import React, { useState } from 'react';
import type { UserRole } from './Portal';
import { PlusIcon, PencilIcon, TrashIcon, XIcon } from './portal/PortalIcons';
import type { BlogPost } from '../src/types/index.ts';

const BlogManagementModal: React.FC<{
    post: Partial<BlogPost>;
    onClose: () => void;
    onSave: (post: Partial<BlogPost>) => void;
}> = ({ post, onClose, onSave }) => {
    const [formData, setFormData] = useState(post);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{post.id ? 'Edit' : 'Create'} Blog Post</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XIcon /></button>
                </div>
                <form id="blog-post-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                            <input type="text" name="author" id="author" value={formData.author || ''} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                            <input type="date" name="publishDate" id="publishDate" value={formData.publishDate || ''} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select name="status" id="status" value={formData.status || 'Draft'} onChange={handleChange} className={inputClass}>
                                <option>Draft</option>
                                <option>Published</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://..." />
                    </div>
                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                        <textarea name="excerpt" id="excerpt" rows={3} value={formData.excerpt || ''} onChange={handleChange} className={inputClass}></textarea>
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <span className="text-sm text-gray-500 tabular-nums">{(formData.content || '').length} / 7500</span>
                        </div>
                        <textarea name="content" id="content" rows={15} maxLength={7500} value={formData.content || ''} onChange={handleChange} className={inputClass}></textarea>
                    </div>
                     <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                        <input type="text" name="tags" id="tags" value={formData.tags?.join(', ') || ''} onChange={handleTagsChange} className={inputClass} />
                    </div>
                </form>
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" form="blog-post-form" className="bg-blue-600 text-white px-4 py-2 text-base font-semibold rounded-md hover:bg-blue-700 transition-colors">Save Post</button>
                </div>
            </div>
        </div>
    );
};

interface BlogManagementModuleProps {
    role: UserRole;
    showToast: (msg: string) => void;
    posts: BlogPost[];
    setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

const BlogManagementModule: React.FC<BlogManagementModuleProps> = ({ role, showToast, posts, setPosts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

    const handleAddNew = () => {
        if (role !== 'admin') return;
        setEditingPost({ status: 'Draft', tags: [], publishDate: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const handleEdit = (post: BlogPost) => {
        if (role !== 'admin') return;
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (role !== 'admin') return;
        if (window.confirm('Are you sure you want to delete this post?')) {
            setPosts(prev => prev.filter(p => p.id !== id));
            showToast('Post deleted successfully.');
        }
    };

    const handleSave = (postToSave: Partial<BlogPost>) => {
        if (postToSave.id) {
            setPosts(prev => prev.map(p => p.id === postToSave.id ? postToSave as BlogPost : p));
            showToast('Post updated successfully.');
        } else {
            const newPost = { ...postToSave, id: `post-${Date.now()}` } as BlogPost;
            setPosts(prev => [newPost, ...prev]);
            showToast('Post created successfully.');
        }
        setIsModalOpen(false);
    };
    
    const sortedPosts = [...posts].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

    return (
        <div className="p-0 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 p-4 sm:p-0">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Blog Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Create, edit, and manage all blog posts.</p>
                </div>
                <button 
                    onClick={handleAddNew} 
                    disabled={role !== 'admin'}
                    className="flex items-center gap-2 text-base bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <PlusIcon /><span>Add New Post</span>
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Author</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPosts.length > 0 ? sortedPosts.map(post => (
                                <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                                    <td className="px-6 py-4">{post.author}</td>
                                    <td className="px-6 py-4">{post.publishDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex justify-end gap-2">
                                        {role === 'admin' ? (
                                            <>
                                                <button onClick={() => handleEdit(post)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon /></button>
                                                <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                            </>
                                        ) : <span className="text-xs text-gray-400 italic">Read-only</span> }
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No blog posts yet. Click "Add New Post" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden">
                    {sortedPosts.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {sortedPosts.map(post => (
                                <li key={post.id} className="p-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-semibold text-gray-900">{post.title}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {post.author} &middot; {post.publishDate}
                                            </p>
                                        </div>
                                        {role === 'admin' && (
                                            <div className="flex items-center flex-shrink-0 -mr-2">
                                                <button onClick={() => handleEdit(post)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon /></button>
                                                <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {post.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-16 px-4 text-gray-500">
                            <p>No blog posts yet.</p>
                            {role === 'admin' && <p className="mt-1">Click "Add New Post" to get started.</p>}
                        </div>
                    )}
                </div>

            </div>

            {isModalOpen && editingPost && (
                <BlogManagementModal
                    post={editingPost}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default BlogManagementModule;
