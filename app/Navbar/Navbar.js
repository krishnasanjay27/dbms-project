'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Blood', path: '/blood' },
    { name: 'Pharmacy', path: '/pharmacy' },
  ];

  const linkStyle = (path) =>
    `hover:text-green-600 font-medium ${
      pathname === path ? 'text-green-700 font-semibold underline underline-offset-4' : 'text-gray-800'
    }`;

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">💊</span>
          <span className="font-bold text-green-700 text-xl">MediConnect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={linkStyle(item.path)}>
              {item.name}
            </Link>
          ))}
        </div>
        
        <div>
          {status === "loading" ? (
            <span className="text-sm">Loading...</span>
          ) : status === "unauthenticated" ? (
            <Button asChild variant="outline" className="border-black">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              {session?.user?.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <Button onClick={handleSignOut} variant="outline" className="border-black">
                Sign Out
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden focus:outline-none text-gray-800"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${linkStyle(item.path)} block`}
              onClick={() => setMenuOpen(false)} // Close menu on selection
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
