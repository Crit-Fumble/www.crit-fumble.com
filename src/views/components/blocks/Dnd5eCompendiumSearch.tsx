import { useRef, useState } from "react";

const Page = () => {
  const resultData = 'test';
  const queryRef = useRef(null);
  const outputRef = useRef(null);
  const onSubmit = async () => {
    const response = await fetch('/play/dnd5e/api' + queryRef.current);
    outputRef.current = await response?.json();
  }
  
  return (
    <div className="input-group pad_top">
      <span className="input-group-addon url">https://www.crit-fumble.com/play/dnd5e/api/</span>
      <input ref={queryRef} id="interactive" type="text" className="form-control" placeholder="spells/acid-arrow/" />
      <span className="input-group-btn"><button onClick={onSubmit} className="btn btn-primary">
        submit
      </button></span>
    </div>
  );
}

export default Page;
