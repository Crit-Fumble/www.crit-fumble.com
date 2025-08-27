import { DEFAULT } from "@/web/config/views";

const getOpenWindowHandler = (...args: any) => () => {
  window.open(...args);
}

const ButtonBlock = ({title, url, target = '', options = 'height=1080, width=1152'}: {title: string, url: string, target?: string, options?: string}) => {

  return (<div className="flex flex-col gap-2">
    <div>
      {title}
    </div>
    <div className="flex flex-row gap-2">
      <button 
        className="border-2 p-2 bg-[rgba(200,100,50,0.25)] flex-1 text-nowrap" 
        onClick={getOpenWindowHandler(url, `popout-${target}`, options)}
      >
        Open Popout
      </button>
      <a 
        className="border-2 p-2 bg-[rgba(150,25,25,0.25)] flex-1 text-nowrap" 
        href={url} 
        target={`tab-${target}`}
      >
        Open Tab
      </a>
    </div>
  </div>);
}

export default ButtonBlock;
