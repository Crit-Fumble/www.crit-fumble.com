import { useEffect, useState } from "react";

export default function useDarkMode() {
    const [isDark, setIsDark] = useState(true);

    const toggleDark = () => {
        
        setIsDark(!isDark);
        //save to local storage
        localStorage.setItem('isDark', JSON.stringify(!isDark));


    }
    useEffect(() => {
        const isDark = JSON.parse(localStorage.getItem('isDark') ?? 'true');
        setIsDark(isDark);
    }, [])

    useEffect(() => {
      document.body.classList[isDark ? 'add' : 'remove']('dark');
    }, [isDark]);


    return { toggleDark, isDark };
}
