"use client";
import Swapper from '@/components/Swapper';
import { useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function SwapperPage() {
  const { connect } = useConnect()

  return (

      <Swapper />
  )
}