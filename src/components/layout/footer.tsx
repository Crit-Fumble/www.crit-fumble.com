import Image from "next/image";
import DarkModeToggle from "./darkModeToggle";

export default function Footer() {
  const linkClass = 'p-2';

  return (
    <footer className="flex-col justify-center w-full pb-4">
      <nav className="flex mt-6 justify-center w-full text-xl" dir="utd">
        <div className={linkClass}>
          <a rel="noopener noreferrer" href={'https://github.com/Crit-Fumble'} target="_blank">
            <Image
              src={"/img/github.png"}
              alt={'Follow us on GitHub'}
              width={128}
              height={51}
            />
          </a>
        </div>
        <div className={linkClass}>
          <a rel="noopener noreferrer" href={'https://app.roll20.net/users/6244861/crit-fumble-gaming'} target="_blank">
            <Image
              src={"/img/roll20.png"}
              alt={'Find Us on Roll20!'}
              width={165}
              height={50}
            />
          </a>
        </div>
        <div className={linkClass}>
          <a rel="noopener noreferrer" href={'https://www.patreon.com/critfumbleweb'} target="_blank">
            <Image
              src={"/img/patreon.avif"}
              alt={'Support us on Patreon'}
              width={213}
              height={50}
            />
          </a>
        </div>
        <div className={linkClass}>
          <a rel="noopener noreferrer" href={'https://discord.gg/dZzsst6TdG'} target="_blank">
            <Image
              src={"/img/discord.avif"}
              alt={'Join our Discord Server'}
              width={155}
              height={50}
            />
          </a>
        </div>
        
      </nav>
      <div className={'text-center'}>
        {/* <DarkModeToggle /> */}
        <p>© {new Date().getFullYear()}, Crit Fumble Gaming</p>
      </div>
    </footer>
  )
}

{/* <div className={linkClass}>
  <a rel="noopener noreferrer" href={'https://startplaying.games/gm/crit-fumble/review'} target="_blank">
    <Image
      src={"./startplaying.png"}
      height={50}
      alt={'Leave us a Review on StartPlaying.Games'}
    />
  </a>
</div> */}
{/* <div className={linkClass}>
  <a rel="noopener noreferrer" href={'https://app.roll20.net/users/6244861/crit-fumble-gaming'} target="_blank">
    <Image
      src={"./roll20.png"}
      height={50}
      alt={'View our Roll20 Profile'}
    />
  </a>
</div> */}
{/* <div className={linkClass}>
  <a rel="noopener noreferrer" href={'https://affiliates.fantasygrounds.com/324256/15958/banner_7299'} target="_blank">
    <Image
      src={"https://affiliates.fantasygrounds.com/banners/316034_3264676826.jpg"}
      height={50}
      alt={'Shop on Fantasy Grounds'}
    />
  </a>
</div> */}
