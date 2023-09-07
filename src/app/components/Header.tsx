"use client"
import React from 'react'
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

function Header() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  if (!isLoaded || !userId) {
    return null;
  }
  return (
    <div className="navbar bg-base-100 flex items-center justify-between">
  <div className="flex-1">
    <a className="btn btn-ghost normal-case text-lg" href='/'>Eco Art</a>
  </div>

  <div className="flex gap-5">
    <UserButton afterSignOutUrl="/" />
  </div>
</div>

  )
}

export default Header
