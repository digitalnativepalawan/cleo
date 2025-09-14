import React from 'react';
import type { BlogPost } from '../src/types/index.ts';

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
                <h3 id={`post-title-${post.id}`} className="font-sans text-xl font-semibold text-gray-800 mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                    {post.title}
                </h3>
                <div className="text-xs text-gray-500 mb-3">
                    By {post.author} on {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <p className="text-sm text-[var(--text-secondary)] flex-grow leading-relaxed">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface BlogSectionProps {
    posts: BlogPost[];
    onViewAllClick: () => void;
    onPostSelect: (post: BlogPost) => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts, onViewAllClick, onPostSelect }) => {
    const latestPosts = posts
        .filter(p => p.status === 'Published')
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, 3);

    return (
        <section className="bg-[var(--bg-secondary)]/70 py-24 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                     <div className="text-left">
                        <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">From the Blog</h2>
                        <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl leading-relaxed">Updates, insights, and stories from the Palawan Ecosystem.</p>
                    </div>
                    <button onClick={onViewAllClick} className="mt-4 sm:mt-0 flex-shrink-0 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300">
                        View All Posts
                    </button>
                </div>

                {latestPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestPosts.map(post => (
                            <BlogPostCard key={post.id} post={post} onSelect={() => onPostSelect(post)} />
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