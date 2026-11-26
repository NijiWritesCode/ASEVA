import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-sand-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block group mb-6">
          <span className="font-serif text-3xl font-extrabold tracking-widest text-obsidian-950 group-hover:text-gold-600 transition-colors">
            ASEVA
          </span>
          <span className="block text-[9px] tracking-[0.3em] text-obsidian-600 uppercase font-sans mt-0.5">
            Operational Management
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-sand-300 rounded-sm sm:px-10">
          <Outlet />
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-obsidian-500">
        <Link to="/" className="text-gold-600 hover:text-gold-700 font-medium">
          ← Return to Public Website
        </Link>
      </div>
    </div>
  );
}
