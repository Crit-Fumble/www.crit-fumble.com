import React from 'react';
import Image from 'next/image';

const Bottombar: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="mb-2">Join our community:</p>
        <a
          href="https://discord.gg/d4jWRM7KqA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center"
        >
          <Image
            src="/img/discord.svg"
            alt="Discord Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          Discord Server
        </a>
      </div>
    </footer>
  );
};

export default Bottombar;