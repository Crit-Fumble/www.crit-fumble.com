"use client";
import useDarkMode from '@/hooks/useDarkMode';

const className = "cursor-pointer bg-transparent transition-colors duration-300 border-none  decoration-none text-primary-500 hover:bg-primary-600 hover:text-white font-light rounded-full centered !outline-none text-xl";
const style = { height: "48px", width: "48px"};

const DarkModeToggle = () => {
  const { isDark, toggleDark } = useDarkMode();

  return <button onClick={toggleDark} style={style} className={className} >
    {isDark ? '🌙' : '☀️'}
    
  </button>
}

export default DarkModeToggle;