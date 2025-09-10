import React, { useState } from 'react';
import type { BlogPost } from '../App';

// Helper function to convert Google Drive links to direct image links
const getDirectImageUrl = (url: string): string => {
    if (url && url.includes('drive.google.com/file/d/')) {
        try {
            // Extracts the file ID from a URL like: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
            const fileId = url.split('/d/')[1].split('/')[0];
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        } catch (error) {
            console.error("Failed to parse Google Drive URL:", url, error);
            return url; // Fallback to the original URL on error
        }
    }
    return url;
};

const BackArrowIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const BlogPostCard: React.FC<{ post: BlogPost; onSelect: () => void; }> = ({ post, onSelect }) => {
    return (
        <div 
            onClick={onSelect} 
            className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            role="article"
            aria-labelledby={`post-title-${post.id}`}
        >
            <div className="relative overflow-hidden">
                <img 
                    src={getDirectImageUrl(post.imageUrl)} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 id={`post-title-${post.id}`} className="font-serif text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                </h3>
                <div className="text-xs text-gray-500 mb-3">
                    By {post.author} on {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <p className="text-sm text-gray-600 flex-grow">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BlogPostDetail: React.FC<{ post: BlogPost; onBack: () => void; }> = ({ post, onBack }) => {
    // Basic markdown-to-HTML conversion.
    const renderContent = (content: string) => {
        // 1. Escape HTML to prevent XSS.
        let safeContent = content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // 2. Convert markdown-like syntax to HTML tags.
        // Convert **bold** to <strong>
        safeContent = safeContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 3. Handle paragraphs and line breaks.
        const paragraphs = safeContent.split('\n\n').map(p => 
            // Wrap paragraphs in <p> tags and convert single newlines to <br>
            `<p>${p.replace(/\n/g, '<br />')}</p>`
        ).join('');
        
        return { __html: paragraphs };
    };

    return (
        <div className="animate-fade-in">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
                 <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-8"
                 >
                    <BackArrowIcon className="h-5 w-5" />
                    Back to All Posts
                </button>
                <article>
                    <header className="mb-8">
                        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
                        <div className="text-sm text-gray-500">
                            Posted by {post.author} on {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </header>
                     <img 
                        src={getDirectImageUrl(post.imageUrl)} 
                        alt={post.title}
                        className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg mb-8"
                    />
                    <div 
                        className="text-gray-700 leading-relaxed space-y-6"
                        dangerouslySetInnerHTML={renderContent(post.content)}
                    />
                </article>
            </div>
        </div>
    );
};


const BlogSection: React.FC<{ posts: BlogPost[]; onBack: () => void; }> = ({ posts, onBack }) => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const publishedPosts = posts.filter(p => p.status === 'Published').sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

    if (selectedPost) {
        return <BlogPostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
    }

    return (
        <section className="bg-gray-50/70 py-24 sm:py-32 animate-fade-in">
            <div className="container mx-auto px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                     <div className="text-left">
                        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#121212]">From the Blog</h2>
                        <p className="text-lg text-gray-600 mt-2 max-w-2xl">Updates, insights, and stories from the Palawan Ecosystem.</p>
                    </div>
                     <button 
                        onClick={onBack} 
                        className="mt-4 sm:mt-0 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                     >
                        <BackArrowIcon className="h-5 w-5" />
                        Back to Home
                    </button>
                </div>

                {publishedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publishedPosts.map(post => (
                            <BlogPostCard key={post.id} post={post} onSelect={() => setSelectedPost(post)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg border">
                        <h3 className="text-xl font-semibold text-gray-700">No posts yet!</h3>
                        <p className="text-gray-500 mt-2">Check back soon for our latest updates.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogSection;