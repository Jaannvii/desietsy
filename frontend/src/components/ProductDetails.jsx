import React,{useEffect,useState}from 'react';
import {useParams}from 'react-router-dom';
import {getProductByld}from'../services/productService';
import{useCart}from'../context/CartContext';

const ProductDetails = () =>{
    const{id}=useParams();
    const[product,setProduct]=useState(null);
    const[loading,setLoading]=useState(true);
    const{addToCart}=useCart();

    useEffect(()=>{
        const fetchProduct=async()=>{
            try{
                const res = await getProductByld(id);
                setProduct(res.data);
            }catch(error){
                console.error('Error fetching product:',error);
            }finally{
                setLoading(false);
            }
        };
        fetchProduct();
    },[id]);

    if(loading) return <div className="text-center mt-10">Loading..</div>;
    if(!product) return <div className="text-center mt-10 text-red-500">Product not found.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 grid-cols-1 md:grid-cols-2 gap-10">
            <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-xl shadow-md"
            />

        <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-lg mb-2"><span className="font=semibold">Category:</span>{product.category}</p>
            <p className="text-xl font-semibold text-green-600 mb-4">{product.price}</p>

            <button
            onClick={() => addToCart(product)}
            className="big-indigo-600 hiver:bg-indigo-700 text-white px-5 py-2 rounded-xl transition duration-200"
            >
                Add to Cart
            </button>
            
            <div className="mt-6 text-sm text-gray-500">
                <p><span className="font-medium text-gray-700">Artisan:</span> {product.artisanName ||'Unknown'}</p>
                <p><span className="font-medium text-gray-700">Material:</span> {product.material ||'Handmade'}</p>
                </div>
            </div>
        </div>
    );
};
export default Product;