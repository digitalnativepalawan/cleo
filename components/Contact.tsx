import React from 'react';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';

const ContactInfoItem = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-[var(--accent-primary)] mt-1">{icon}</div>
        <div>
            <h4 className="text-base font-semibold text-gray-800">{title}</h4>
            <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{children}</div>
        </div>
    </div>
);

const Contact: React.FC = () => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string || 'Website Inquiry: Palawan Integrated Tourism Ecosystem';
        const message = formData.get('message') as string;

        const body = `You have received a new message from the contact form on your website.

From: ${name}
Email: ${email}

Message:
${message}
`;

        const mailtoLink = `mailto:david@bingabeach.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };
    
    const formInputClasses = "w-full px-4 py-2 bg-[var(--bg-primary)] border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-200";

    return (
        <section id="contact" className="bg-[var(--bg-secondary)]/50 py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">
                        Let's Build the Future of Palawan
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-3xl mx-auto leading-relaxed">
                        We welcome inquiries from potential investors, partners, and stakeholders. Reach out to discuss how we can collaborate.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[var(--bg-primary)] p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-100">
                    {/* Left side: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-6 border-b pb-3 tracking-tight leading-tight">Contact Information</h3>
                            <div className="space-y-6">
                                <ContactInfoItem icon={<MailIcon />} title="Email Inquiry">
                                    <a href="mailto:david@bingabeach.com" className="hover:text-[var(--accent-primary)] transition-colors">david@bingabeach.com</a>
                                </ContactInfoItem>
                                <ContactInfoItem icon={<PhoneIcon />} title="Phone">
                                    <a href="tel:+639474443597" className="hover:text-[var(--accent-primary)] transition-colors">+63 947 444 3597</a>
                                </ContactInfoItem>
                                <ContactInfoItem icon={<LocationMarkerIcon />} title="Office Address">
                                    <p>Lumambong Beach, Palawan Island 5309</p>
                                </ContactInfoItem>
                            </div>
                        </div>
                         <div>
                            <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-4 border-b pb-3 tracking-tight leading-tight">Key Contacts</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-800">John Doe</p>
                                    <p className="text-gray-500">Director, Cleopatra SIRV Holdings</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">David</p>
                                    <p className="text-gray-500">Lead, Binga Beach Brothers Inc.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Form */}
                    <div>
                        <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-6 tracking-tight leading-tight">Send Us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="name" id="name" required className={formInputClasses} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" name="email" id="email" required className={formInputClasses} />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject (Optional)</label>
                                <input type="text" name="subject" id="subject" className={formInputClasses} />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea name="message" id="message" rows={5} required className={formInputClasses}></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-[var(--accent-primary)] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none">
                                    Send Inquiry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
