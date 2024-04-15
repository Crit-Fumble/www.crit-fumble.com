import Footer from "@/components/layout/footer";
import Image from "next/image";

export default function SelectScreen() {
  // TODO: SEO and things
  
  // TODO: Add controls to allow GM to navigate between screens

  return (
      <div className={'flex flex-col justify-center text-center'}>
        <nav>
          <a href="/systems/dnd5e">
            D&D 5e
          </a> | 
          <a href="/systems/cypher2e">
            Cypher 2e
          </a> | <a href="/">
            Back to Home
          </a>
        </nav>
      </div>
  );
}
