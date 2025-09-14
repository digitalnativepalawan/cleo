import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <div className="container mx-auto px-6 py-24 sm:py-32 text-center flex flex-col items-center justify-center">
                <a href="#" aria-label="Binga Beach Homepage" className="block shrink-0 mb-8">
                    <img src="https://bingabeach.com/wp-content/uploads/2019/02/cropped-bb-logo.png" alt="Binga Beach Logo" className="w-auto h-20 md:h-24 transition-transform duration-300 hover:scale-105" />
                </a>
                <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-4 max-w-[22ch] mx-auto">
                    The Future of Real World Assets in Palawan
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-[var(--text-secondary)] mb-10 max-w-[40ch] mx-auto leading-relaxed">
                    Villas, farming, hardware, and digital integration
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button className="w-full sm:w-auto bg-[var(--accent-primary)] text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                        Download Deck
                    </button>
                    <button className="w-full sm:w-auto bg-transparent border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-semibold py-3 px-8 rounded-lg hover:bg-[var(--text-primary)] hover:text-white transition-all duration-300 transform hover:scale-105">
                        Schedule Call
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
