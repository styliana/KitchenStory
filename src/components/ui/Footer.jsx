import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-orange-50 border-t border-orange-100 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 text-center">
        <p className="text-orange-800/60 text-sm">
          &copy; {new Date().getFullYear()} KitchenStory.insert.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          smacznego yay
        </p>
      </div>
    </footer>
  );
}