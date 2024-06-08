"use client";
import Swapper from '@/components/Swapper';
import { useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function Courses() {
  const { connect } = useConnect()

  return (
    <div>
      <Swapper />
    </div>
  )
}