import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Bimbel Master</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Platform pembelajaran terbaik untuk meningkatkan prestasi akademik Anda.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="/about" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact Info</h4>
                        <div className="space-y-2">
                            <p className="text-gray-600 text-sm">Email: info@bimbelmaster.com</p>
                            <p className="text-gray-600 text-sm">Phone: +62 123 456 789</p>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 mt-6 pt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Bimbel Master. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;