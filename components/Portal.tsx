import React, { useState, useEffect } from 'react';
import { ProjectsWorkspace } from './ProjectManagement';
import { KeyIcon } from './icons/KeyIcon';
import { XIcon } from './icons/XIcon';
import type { BlogPost } from '../App';
import type { ProjectData } from '../types/portal';

interface PortalProps {
    isOpen: boolean;
    onClose: () => void;
    posts: BlogPost[];
    setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
    projectsData: Record<string, ProjectData>;
    setProjectsData: React.Dispatch<React.SetStateAction<Record<string, ProjectData>>>;
}

type PortalStep = 'role-select' | 'workspace';
export type UserRole = 'admin' | 'investor';

const Portal: React.FC<PortalProps> = ({ isOpen, onClose, posts, setPosts, projectsData, setProjectsData }) => {
    const [step, setStep] = useState<PortalStep>('role-select');
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when closed
            setTimeout(() => {
                setStep('role-select');
                setRole(null);
            }, 300); // Allow for closing animation
        }
    }, [isOpen]);
    
    const handleSelectRole = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setStep('workspace');
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 transition-opacity duration-300"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-none md:rounded-2xl shadow-2xl w-full h-full flex flex-col relative overflow-hidden">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-50"
                    aria-label="Close Portal"
                >
                    <XIcon className="h-8 w-8" />
                </button>

                {step === 'role-select' && (
                     <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50">
                        <div className="w-full max-w-sm text-center p-4">
                            <KeyIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-gray-800 mb-2">Investor & Admin Portal</h2>
                            <p className="text-gray-600 mb-8">Please select your role to proceed.</p>
                            <div className="space-y-4">
                               <button onClick={() => handleSelectRole('admin')} className="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-900 transition-all duration-300 transform hover:scale-105">
                                    Log in as Admin
                                </button>
                               <button onClick={() => handleSelectRole('investor')} className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                                    Log in as Investor
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'workspace' && role && (
                    <ProjectsWorkspace 
                        role={role} 
                        onSignOut={onClose} 
                        blogPosts={posts}
                        setBlogPosts={setPosts}
                        projectsData={projectsData}
                        setProjectsData={setProjectsData}
                    />
                )}
            </div>
        </div>
    );
};

export default Portal;
