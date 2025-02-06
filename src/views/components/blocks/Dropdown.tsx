import React, { useState } from 'react';

// Dropdown component
export const Dropdown: React.FC<{ options: Array<{ label: string; value: string }>; className?: string }> = ({ options, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="bg-[#552e66] text-white p-4 w-full text-left rounded-lg shadow-md"
      >
        {selectedOption ? options.find(option => option.value === selectedOption)?.label : 'Select an option'}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10 border border-gray-300 dark:border-gray-700">
          {options.map(option => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};