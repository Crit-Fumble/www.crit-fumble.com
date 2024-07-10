import { useLayoutEffect, useState } from "react";

export default function useDarkMode() {
    const [isDark, setIsDark] = useState(true);

    const toggleDark = () => {
        
        setIsDark(!isDark);
        //save to local storage
        localStorage.setItem('isDark', JSON.stringify(!isDark));


    }
    useLayoutEffect(() => {
        const isDark = JSON.parse(localStorage.getItem('isDark') ?? 'true');
        setIsDark(isDark);
    }, [])

    useLayoutEffect(() => {
      document.body.classList[isDark ? 'add' : 'remove']('dark');
    }, [isDark]);


    return { toggleDark, isDark };
}
