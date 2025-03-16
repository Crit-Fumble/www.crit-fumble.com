"use client";
import NavigationMenu from "../blocks/NavigationMenu";

export const TopBarSession = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0, 
        left: 0, 
        padding: 0,
        margin: 0,
        width: '100%',
      }}
    >
      <NavigationMenu />
    </div>
  );
};
