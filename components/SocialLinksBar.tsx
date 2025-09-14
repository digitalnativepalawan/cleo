import React from 'react';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterXIcon } from './icons/TwitterXIcon';
import { GitHubIcon } from './icons/GitHubIcon';

const socialLinksData = [
    { name: 'YouTube', href: 'https://www.youtube.com/bingabeach', icon: <YouTubeIcon /> },
    { name: 'Instagram', href: 'https://www.instagram.com/bingabeachpalawan/', icon: <InstagramIcon /> },
    { name: 'Facebook', href: 'https://www.facebook.com/bingabeachresort', icon: <FacebookIcon /> },
    { name: 'X/Twitter', href: 'https://x.com/bingabeach', icon: <TwitterXIcon /> },
    { name: 'GitHub', href: 'https://github.com/digitalnativepalawan/cleo', icon: <GitHubIcon /> },
];

const SocialLinks: React.FC<{className?: string}> = ({ className }) => {
    return (
        <div className={`flex items-center space-x-3 md:space-x-4 ${className}`}>
            {socialLinksData.map(link => (
                <a 
                    key={link.name} 
                    href={link.href} 
                    aria-label={link.name} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors duration-200"
                >
                    {React.cloneElement(link.icon, { className: 'h-5 w-5' })}
                </a>
            ))}
        </div>
    );
};

export default SocialLinks;