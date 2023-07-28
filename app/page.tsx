import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import Image from 'next/image'
import { writeFile } from 'fs/promises'
import StoreNameInput from '@/ui/store-name-input'

async function createMerchantWalletKeypair(): Promise<Keypair> {
  let keypair: Keypair | undefined
  if (!process.env.MERCHANT_WALLET) {
    console.log("Generating new keypair as merchant wallet")
    keypair = Keypair.generate()
    
    console.log("Writing secret key to the .env.local file, returning keypair...");
    const curr_dir = process.cwd()
    await writeFile(`${curr_dir}/.env.local`,`MERCHANT_WALLET=[${keypair.secretKey.toString()}]`)
    console.log("Funding 1 SOL to this new wallet...")
    await getDevnetSolToken(keypair.publicKey)
    return keypair
  }

  console.log("Found existing secret key in .env.local file, returning keypair from secretkey...");
  
  keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.MERCHANT_WALLET)))

  return keypair
}

async function getDevnetSolToken(pubKey: PublicKey) {
  const connection = new Connection(clusterApiUrl('devnet'))
  const signature = await connection.requestAirdrop(pubKey, 1 * LAMPORTS_PER_SOL)
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature
  },'finalized');

  console.log(`Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
}

export default async function Home() {

  const merchant_keypair = await createMerchantWalletKeypair()
  
  return (
   
    <section>
    <div className="relative flex justify-center max-h-full overflow-hidden lg:px-0 md:px-12">
      <div className="min-h-screen relative z-10 flex flex-col flex-1 px-4 py-10 bg-white shadow-2xl lg:py-24 md:flex-none md:px-28 sm:justify-center">
        <div className="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4">
          <div className="flex flex-col">
            <div>
              <h2 className="text-4xl text-black">Let&rsquo;s get started!</h2>
              <p className="mt-2 text-sm text-gray-500">
                Provide a name for your Merchant Store
              </p>
            </div>
          </div>
          <form>
            <input autoComplete="false" name="hidden" style={{display: "none"}}/>
            <input name="_redirect" type="hidden" value="#"/>
            <div className="mt-4 space-y-6">
              {/* input */}
              <StoreNameInput />
            </div>
          </form>
        </div>
      </div>
      <div className="hidden bg-white lg:block lg:flex-1 lg:relative sm:contents">
        <div className="absolute inset-0 object-cover w-full h-full bg-white" >
          <Image className="object-center w-full h-auto bg-gray-200" src="https://d33wubrfki0l68.cloudfront.net/64c901dbc4b16388ef27646a320ad9c1441594df/236fd/images/placeholders/rectangle2.svg" alt="" width="1310" height="873"/>
        </div>
      </div>
    </div>
  </section>

  )
}
