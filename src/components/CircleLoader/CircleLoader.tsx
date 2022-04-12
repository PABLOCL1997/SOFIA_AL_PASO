import React, { Suspense, FC, useEffect } from "react";

import { Loader, Text } from "./style";

type Props = {
  noHeader?: boolean;
  noHeight?: boolean;
  showText?: boolean;
  text?: string;
};

const CircleLoader: FC<Props> = ({ noHeader = false, noHeight, showText, text }) => {
  return (
    <Suspense fallback={<div></div>}>
      <Loader noHeader={noHeader} noHeight={noHeight}>
        <img src="/images/loader.svg" alt="loader" />
        {showText ? <Text>{text}</Text> : null}
      </Loader>
    </Suspense>
  );
};

export default CircleLoader;
