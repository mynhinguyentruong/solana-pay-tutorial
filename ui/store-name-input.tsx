'use client'

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

export default function StoreNameInput() {
    const router = useRouter()
    const [userInput, setUserInput] = useState("")

    const navigate = useCallback(() => {
        const encodeString = encodeURI(userInput)
        router.push(`/product?store=${encodeString}`)
    }, [userInput, router])

    return (
        <>
            <div>
                <label className="block mb-3 text-sm font-medium text-gray-600" id="name">
                  Store&rsquo;s name

                </label>
                <input
                    name={userInput}
                    onChange={(e) => setUserInput(e.target.value)} 
                    className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="Store's name"/>
            </div>
            
            <div className="col-span-full">
                <button 
                    type="button"
                    onClick={navigate}
                    className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"> 
                    Generate Store
                </button>
            </div>
        </>
    )
}