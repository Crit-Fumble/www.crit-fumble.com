import Footer from "@/components/layout/footer";
import Image from "next/image";

export default function DndSrd5eScreen() {
  // TODO: SEO and things
  
  // TODO: Add controls to allow GM to navigate between screens

  return (
      <div className={'flex flex-col justify-center text-center'}>
        <nav>
          <a href="https://www.5esrd.com" target="_blank">
            Open in New Tab
          </a> | <a href="/">
            Back to Home
          </a>
        </nav>
        <iframe src="https://www.5esrd.com" className={'h-screen'}></iframe>
      </div>
  );
}
