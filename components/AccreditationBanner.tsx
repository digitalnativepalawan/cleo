import React from 'react';

const AccreditationBanner: React.FC = () => {
    return (
        <section className="bg-white py-12 sm:py-16">
            <div className="container mx-auto px-6 text-center flex flex-col items-center justify-center">
                <img 
                    src="https://bingabeach.com/wp-content/uploads/2025/08/PRA-LOGO-1.png" 
                    alt="Philippine Retirement Authority Logo" 
                    className="w-auto h-24 mb-6"
                />
                <h3 className="font-sans text-2xl font-semibold text-gray-800 mx-auto tracking-tight leading-tight">
                    First Resort in Palawan accredited by the Philippine Retirement Authority
                </h3>
            </div>
        </section>
    );
};

export default AccreditationBanner;