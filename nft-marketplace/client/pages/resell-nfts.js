import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'

import Marketplace from '../contracts/optimism-contracts/Marketplace.json'
import BoredPetsNFT from '../contracts/optimism-contracts/BoredPetsNFT.json'

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput

  useEffect(() => { fetchNFT() }, [id])

  async function fetchNFT() {
    if (!tokenURI) {
        return
    } else {
        const meta = await axios.get(tokenURI)
        updateFormInput(state => ({ ...state, image: meta.data.image }))
    }
  }

  async function listNFTForSale() {
    if (!price) {
        return
    } else {
        const web3Modal = new Web3Modal()
        const provider = await web3Modal.connect()
        const web3 = new Web3(provider)
        const networkId = await web3.eth.net.getId()
        const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, "0x0c9213aCA6172fCf6a58964f10444b627F3aa4B9")
        let listingFee = await marketPlaceContract.methods.LISTING_FEE().call()
        listingFee = listingFee.toString()
        const accounts = await web3.eth.getAccounts()
        marketPlaceContract.methods.resellNft("0xE5E9F9ab877A31b36E77c3d7C3C5ec585d2de21E", id, Web3.utils.toWei(formInput.price, "ether"))
            .send({ from: accounts[0], value: listingFee }).on('receipt', function () {
                router.push('/')
            });
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        {
          image && (
            <img className="rounded mt-4" width="350" src={image} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-teal-400 text-white rounded p-4 shadow-lg">
          List NFT
        </button>
      </div>
    </div>
  )
}
