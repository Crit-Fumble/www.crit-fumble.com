import { SATISFACTORY } from "@/views/config";

const getOpenWindowHandler = (...args: any) => () => {
  window.open(...args);
}

const ButtonBlock = ({title, url, target = '', options = 'height=1080, width=1152'}: {title: string, url: string, target?: string, options?: string}) => {

  return (<>
    <div className={""}>
      {title}
    </div>
    <div className="flex flex-row gap-2">
      <button className={ SATISFACTORY.TW_CLASSES.BUTTON + " text-nowrap" } onClick={getOpenWindowHandler(url, `popout-${target}`, options)}>
        Open Popout
      </button>
      <a className={ SATISFACTORY.TW_CLASSES.LINK + " text-nowrap" } href={url} target={`tab-${target}`}>
        Open Tab
      </a>
    </div>
  </>);
}

export default ButtonBlock;
