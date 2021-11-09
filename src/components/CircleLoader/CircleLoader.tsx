import React, { Suspense, FC, useEffect } from "react";

import { Loader } from "./style";

type Props = {
  noHeader?: boolean;
  noHeight?: boolean;
};

const CircleLoader: FC<Props> = ({ noHeader = false, noHeight }) => {
  return (
    <Suspense fallback={<div></div>}>
      <Loader noHeader={noHeader} noHeight={noHeight}>
        <img src="/images/loader.svg" alt="loader" />
      </Loader>
    </Suspense>
  );
};

export default CircleLoader;
