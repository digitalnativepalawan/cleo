import React from 'react';
import SocialLinks from './SocialLinksBar';

// Internal Icon components to keep file changes minimal
const FooterShieldIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const FooterLeafIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 21c8 0 14-6 14-14V3C11 3 5 9 5 17v4z"/></svg>
);

const FooterBuildingIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M5 21V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13M9 21V4h6v17"/></svg>
);

const FooterPassportIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 6h10M7 12h10M7 16h6"/></svg>
);

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            {/* Top strip: trust badges */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
                <div className="flex flex-wrap items-center justify-center gap-3 md:justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                           <FooterShieldIcon />
                        </span>
                        <span className="text-sm font-medium">SEC-Compliant Structure</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-700">
                           <FooterLeafIcon />
                        </span>
                        <span className="text-sm font-medium">ECC & Environmental Stewardship</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                           <FooterBuildingIcon />
                        </span>
                        <span className="text-sm font-medium">TIEZA Tourism Zone Benefits</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                           <FooterPassportIcon />
                        </span>
                        <span className="text-sm font-medium">SIRV Residency Pathway</span>
                    </div>
                </div>
            </div>

            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">

                    {/* Brand & blurb */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-semibold text-lg">Cleopatra SIRV × Binga Beach Brothers</span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                            A balanced alliance delivering real-world assets in Palawan: eco-villas & resort ops, farm-to-table agriculture,
                            hardware & construction supply, and compliant structures with transparent reporting.
                        </p>

                        {/* Newsletter */}
                        <form className="mt-4 flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" required placeholder="Enter your email"
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="submit" className="w-full sm:w-auto whitespace-nowrap rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black border border-black hover:bg-black hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">Join our quarterly update</button>
                        </form>

                        {/* Social */}
                        <div className="mt-4">
                            <SocialLinks />
                        </div>
                    </div>

                    {/* Quick Nav */}
                    <nav className="text-sm">
                        <h4 className="font-semibold text-gray-900">Navigate</h4>
                        <ul className="mt-3 space-y-2 text-gray-600">
                            <li><a className="hover:text-gray-900" href="#summary">Executive Summary</a></li>
                            <li><a className="hover:text-gray-900" href="#market">Market</a></li>
                            <li><a className="hover:text-gray-900" href="#financials">Financials</a></li>
                            <li><a className="hover:text-gray-900" href="#risks">Risks</a></li>
                            <li><a className="hover:text-gray-900" href="#action-plan">Timeline</a></li>
                        </ul>
                    </nav>

                    {/* Verticals */}
                    <nav className="text-sm">
                        <h4 className="font-semibold text-gray-900">Verticals</h4>
                        <ul className="mt-3 space-y-2 text-gray-600">
                            <li>Resort & Eco-Villas</li>
                            <li>Farming & Agri-Tourism</li>
                            <li>Hardware & Construction Supply</li>
                            <li>Third-Party Asset Mgmt</li>
                        </ul>
                    </nav>

                    {/* Resources */}
                    <nav className="text-sm">
                        <h4 className="font-semibold text-gray-900">Resources</h4>
                        <ul className="mt-3 space-y-2 text-gray-600">
                            <li><a className="hover:text-gray-900" href="#">Download Deck (PDF)</a></li>
                            <li><a className="hover:text-gray-900" href="#contact">Schedule Briefing</a></li>
                            <li><a className="hover:text-gray-900" href="#">FAQ</a></li>
                            <li><a className="hover:text-gray-900" href="#contact">Contact</a></li>
                        </ul>
                    </nav>

                    {/* Contact */}
                    <div className="text-sm">
                        <h4 className="font-semibold text-gray-900">Contact</h4>
                        <ul className="mt-3 space-y-2 text-gray-600">
                            <li>San Vicente – Lumambong Beach, Palawan</li>
                            <li><a className="hover:text-gray-900" href="mailto:hello@palawan-ecosystem.com">hello@palawan-ecosystem.com</a></li>
                            <li><a className="hover:text-gray-900" href="tel:+639000000000">+63 900 000 0000</a></li>
                        </ul>

                        {/* Locale toggles */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <select aria-label="Language" className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm">
                                <option>English</option>
                                <option>한국어 (KR)</option>
                                <option>中文 (CN)</option>
                            </select>
                            <select aria-label="Currency" className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm">
                                <option>PHP ₱</option>
                                <option>USD $</option>
                                <option>EUR €</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance & legal */}
            <div className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 text-xs text-gray-600">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">SEC</span>
                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-green-700">ECC</span>
                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">TIEZA</span>
                        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-indigo-700">SIRV</span>
                        <span className="text-gray-400">|</span>
                        <span>SEC Reg. Nos.: <em>Cleopatra SIRV Holdings Inc. — [xxxxxx]; Binga Beach Brothers Inc. — [xxxxxx]</em></span>
                    </div>

                    <p className="mt-3 leading-relaxed">
                        <strong>Disclosures.</strong> This material is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer
                        to buy securities. Any offering will be made only to qualified or accredited investors pursuant to formal offering documents and
                        in compliance with applicable securities laws. Forward-looking statements involve risks and uncertainties; actual results may differ
                        materially. Obtain independent legal, tax, and investment advice.
                    </p>

                    <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="text-gray-500">© {new Date().getFullYear()} Cleopatra SIRV Holdings Inc. & Binga Beach Brothers Inc. All rights reserved.</div>
                        <div className="flex flex-wrap gap-4">
                            <a className="hover:text-gray-900" href="#">Privacy</a>
                            <a className="hover:text-gray-900" href="#">Terms</a>
                            <a className="hover:text-gray-900" href="#">Disclosures</a>
                            <a className="hover:text-gray-900" href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;