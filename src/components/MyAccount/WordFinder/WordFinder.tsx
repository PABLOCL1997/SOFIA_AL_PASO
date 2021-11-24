import React, { Suspense, FC, useState } from "react";
import MagnifyIcon from "../../../assets/images/magnify.svg";
import { Wrapper } from "./style";

type Props = {
  setWord?: any;
  label?: string;
};

const WordFinder: FC<Props> = ({ setWord, label = "Buscar por palabra clave" }) => {
  const [newWord, setNewWord] = useState("");

  return (
    <Suspense fallback={<div></div>}>
      <Wrapper className="buscadorPalabra">
        <img src={MagnifyIcon} alt="" />
        <input
          value={newWord}
          placeholder={label}
          onChange={(event) => {
            setNewWord(event.target.value);
            setWord(event.target.value);
          }}
        />
      </Wrapper>
    </Suspense>
  );
};

export default WordFinder;
