'use client'

import Image from "next/image"
import { createQR, encodeURL } from "@solana/pay"; // error: document is undefined, as nextjs server does not have document's methods as in vanilla js
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";



export default function Page({params}: { params: { total: string }}) {
  const ref = useRef(null)
  const searchParams = useSearchParams()
  const store = searchParams.get('store') || "Store"
  const total = searchParams.get('total') || 1

  useEffect(() => {
    // get url link and pass into createQR()
    const link = new URL(
      `https://78d1-142-118-195-176.ngrok-free.app/api/checkout?total=${total}&store=${store}`
    );

    const url = encodeURL({link})
    console.log({url})
    const qrCode = createQR(url)

    if (ref.current) {
      qrCode.append(ref.current)
    }
  },[params.total])
    
    return (
        
    <section>
    <div className="relative flex justify-center min-h-screen overflow-hidden lg:px-0 md:px-12">
      <div className="relative z-10 flex flex-col flex-1 px-2 py-10 bg-white shadow-2xl lg:py-24 md:flex-none md:px-32 sm:justify-center">
        <div className="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4 mr-10">
          <div className="flex flex-col">
            <div>
              <h2 className="text-4xl text-black">Checkout</h2>
              {/* <p className="mt-2 text-sm text-gray-500">
                $40
              </p> */}
            </div>
          </div>
          <form>
            <input autoComplete="false" name="hidden" style={{display: "none"}}/>
            <input name="_redirect" type="hidden" value="#"/>
            <div className="mt-4 space-y-6">
              <div className="flex justify-between">
                <label className="mb-3 text-sm font-medium text-gray-600" id="name">
                  Order Total
                </label>
                {/* <input className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="Your name"/> */}
                <p className="text-sm font-medium text-gray-600">{total} USDC</p>
              </div>
              <div className="col-span-full">
                <label className="block mb-3 text-sm font-medium text-gray-600" id="company">
                  Your QR Code
                </label>
              </div>
              <div className="max-w-md p-2" ref={ref}></div>
             
              
              <div className="col-span-full">
                {/* <button className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black" type="submit">
                  Verify Transaction
                </button> */}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden bg-white lg:block lg:flex-auto w-32 lg:relative sm:contents">
        <div className="absolute inset-0 object-cover w-full h-full bg-white" >
          <Image className="object-center w-full h-auto bg-gray-200" src="https://d33wubrfki0l68.cloudfront.net/64c901dbc4b16388ef27646a320ad9c1441594df/236fd/images/placeholders/rectangle2.svg" alt="" width="1200" height="873"/>
        </div>
      </div>
    </div>
  </section>
    )
}