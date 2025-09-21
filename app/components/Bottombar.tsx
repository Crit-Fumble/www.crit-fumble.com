import React from 'react';

const Bottombar: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="mb-2">Join our community:</p>
        <a
          href="https://discord.gg/d4jWRM7KqA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Discord Server
        </a>
      </div>
    </footer>
  );
};

export default Bottombar;