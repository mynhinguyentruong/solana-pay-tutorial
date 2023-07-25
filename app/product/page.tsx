'use client'
import Image from "next/image"
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import CartPreview from "@/ui/cart-preview"
import { Dispatch, Fragment, SetStateAction, useCallback, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from "next/link"

export type Product = {
    id: number;
    name: string;
    href: string;
    color: string;
    price: number;
    quantity: number;
    imageSrc: string;
    imageAlt: string;
}


const products = [
  {
    id: 0,
    name: 'Throwback Hip Bag',
    href: '#',
    color: 'Salmon',
    price: 1,
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
  },
  {
    id: 1,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: 2,
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  // More products...
]
export default function Page() {
    const [open, setOpen] = useState<boolean>(true)
    const [cartItems, setCartItems] = useState<Product[]>([])

    const addItem = (product: Product) => {
        setCartItems(prevItem => [...prevItem, product])
    }

    const total = useCallback(() => {
        return products?.reduce((acc, curr) => acc + curr.price, 0)
    }, [products])
    return (
<div className="">
  <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
    <div className="flex justify-end">
 
            <ShoppingBagIcon className="h-10 w-10 cursor-pointer" aria-hidden="true" onClick={() => setOpen(true)}/>

    </div>

  <h2 className="font-bold mb-10 text-3xl pb-10">Products</h2>

    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
    {products.map(product => (
             <a key={product.id} className="group">
             <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
               <Image width={280} height={320} src={product.imageSrc} alt={product.imageAlt} className="h-full w-full object-cover object-center group-hover:opacity-75"/>
             </div>
             <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
             <p className="mt-1 text-lg font-medium text-gray-900">{product.price} USDC</p>
             <button onClick={() => addItem(product)} className="mt-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded">Add to cart</button>
           </a> 
    ))}
   
    </div>
  </div>
    <CartPreview open={open} setOpen={setOpen} products={cartItems}/>
</div>
    )
}