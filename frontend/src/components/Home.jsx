import React from 'react';
import { Link } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-orange-100 py-12 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-orange-700 mb-4">
                    Welcome to Desi Etsy
                </h1>
                <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6">
                    Explore handmade treasures from local artisans across India.
                </p>
                <Link to="/products">
                    <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
                        Shop Now
                    </button>
                </Link>
            </section>

            <section className="py-10 px-6">
                <h2 className="text-2xl font-semibold mb-4 text-center text-orange-700">
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {[
                        'Pottery',
                        'Handmade Jewelry',
                        'Textiles',
                        'Home Decor',
                    ].map((cat) => (
                        <Link key={cat} to={'/products?category=${cat}'}>
                            <div className="bg-white shadow-md hover:shadow-xl p-6 rounded-xl text-center transition-all">
                                <p className="text-md font-medium text-gray-700">
                                    {cat}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="py-10 px-6 bg-white">
                <h2 className="text-2xl font-semibold mb-6 text-center text-orange-700">
                    Featured Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {featuredProducts.map((product) => (
                        <ProductDetails key={product._id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;