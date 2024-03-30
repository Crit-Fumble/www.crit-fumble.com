"use client";
import useDarkMode from '@/hooks/useDarkMode';

const DarkModeToggle = () => {
  const { isDark, toggleDark } = useDarkMode();

  return <button onClick={toggleDark} style={{height: '1.6em', width: '1.6em', marginBottom: '16px'}} className="p1 cursor-pointer bg-transparent transition-colors duration-300 border-none  decoration-none text-primary-500 hover:bg-primary-600 hover:text-white font-light rounded-full centered !outline-none text-xl" >
    {isDark ? '🌙' : '☀️'}
    
  </button>
}

export default DarkModeToggle;