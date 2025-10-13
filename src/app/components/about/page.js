import React from 'react';
import { MapPin, Phone, Clock, Star, Award, Users, Package } from 'lucide-react';
import Footer from '../footer/page';
import Navbar from '../navbar/page';

export default function AboutUs() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen   to-white">
                <div className='h-10' > </div>
                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 py-12">
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <p className="text-lg text-gray-700 leading-relaxed mb-4">
                                Welcome to <span className="font-semibold" style={{ color: '#047F05' }}>Mamta Hardware</span>, your premier destination for high-quality plywood and hardware supplies in Bela Pratapgarh, Uttar Pradesh. Located conveniently near Durga Mandir in Balipur, we have been serving our community with dedication and excellence.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed mb-4">
                                With an outstanding <span className="font-semibold">4.9-star rating</span> on Google, we take pride in being one of the most trusted plywood suppliers in the region. Our commitment to quality products, competitive pricing, and exceptional customer service has made us the go-to choice for builders, contractors, and homeowners alike.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Whether you're working on a small home improvement project or a large-scale construction, Mamta Hardware is here to provide you with the finest materials and expert guidance to bring your vision to life.
                            </p>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Us</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                                <Award className="w-12 h-12 mb-4" style={{ color: '#047F05' }} />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Quality</h3>
                                <p className="text-gray-600">We stock only the finest quality plywood and hardware materials from trusted brands.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                                <Users className="w-12 h-12 mb-4" style={{ color: '#047F05' }} />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Service</h3>
                                <p className="text-gray-600">Our knowledgeable team provides personalized guidance for all your project needs.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                                <Package className="w-12 h-12 mb-4" style={{ color: '#047F05' }} />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Wide Selection</h3>
                                <p className="text-gray-600">Extensive inventory of plywood varieties, hardware, and construction materials.</p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Visit Us</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Location Card */}
                            <div className="text-white rounded-lg shadow-lg p-8" style={{ background: 'linear-gradient(to bottom right, #047F05, #036304)' }}>
                                <MapPin className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">Location</h3>
                                <p className="text-lg leading-relaxed mb-2">
                                    Near Durga Mandir, Balipur<br />
                                    Bela Pratapgarh, Uttar Pradesh<br />
                                    PIN: 230001
                                </p>
                                <p className="text-green-100 mt-4">📍 Just 8 minutes away from city center</p>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-white rounded-lg shadow-lg p-8 border-2" style={{ borderColor: '#047F05' }}>
                                <div className="mb-6">
                                    <Phone className="w-10 h-10 mb-4" style={{ color: '#047F05' }} />
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Contact Us</h3>
                                    <a href="tel:07275759000" className="text-xl font-semibold hover:underline" style={{ color: '#047F05' }}>
                                        072757 59000
                                    </a>
                                </div>

                                <div>
                                    <Clock className="w-10 h-10 mb-4" style={{ color: '#047F05' }} />
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Business Hours</h3>
                                    <p className="text-lg text-gray-700">
                                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                        Open Now
                                    </p>
                                    <p className="text-gray-600 mt-2">Closes at 8:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </section>  
                </main> 
            </div>
            <Footer />
        </>
    );
}