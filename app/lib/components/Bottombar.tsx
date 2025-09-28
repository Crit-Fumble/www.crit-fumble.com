import React from 'react';
import Image from 'next/image';

const Bottombar: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <a
          href="https://discord.gg/d4jWRM7KqA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center"
        >
          <Image
            src="/img/discord.svg"
            alt="Discord Icon"
            width={48}
            height={48}
            className="mr-2"
          />
        </a>
      </div>
    </footer>
  );
};

export default Bottombar;