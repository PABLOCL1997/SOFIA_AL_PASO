import React, { Suspense, FC, useState, useEffect } from "react";
import { Wrapper, Box, Divider, Mask } from "./style";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-apollo";
import { GET_USER } from "../../../graphql/user/queries";

const Tabs = React.lazy(() => import(/* webpackChunkName: "Tabs" */ "../../Tabs"));
const Details = React.lazy(() => import(/* webpackChunkName: "Details" */ "../Details/Details"));
const Orders = React.lazy(() => import(/* webpackChunkName: "Orders" */ "../Orders"));
const Bills = React.lazy(() => import(/* webpackChunkName: "Bills" */ "../Bills"));

type Props = {};
const Container: FC<Props> = () => {
  const [active, setActive] = useState("");
  const [orderId, setOrderId] = useState<any>(null);
  const [repeatOrder, setRepeatOrder] = useState<any>(null);
  const [maskOn, setMaskOn] = useState(false);
  const { data: userData } = useQuery(GET_USER);
  const history = useHistory();
  const query = history.location.search;

  useEffect(() => {
    if (query === "?datos") return setActive("");

    if (query.startsWith("?historial")) {
      const url: URL = new URL(window.location.href);
      const params: URLSearchParams = url.searchParams;
      const id: any = params.get("id");
      const repeat: any = params.get("repetir") ? true : false;
      setRepeatOrder(repeat);
      setOrderId(id);
      setActive("historial");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!userData.userInfo.length || !userData.userInfo[0].isLoggedIn) {
      history.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense fallback={<div></div>}>
      {maskOn && <Mask />}

      <Wrapper>
        <Box>
          <Tabs active={active} setActive={setActive} />
          <Divider />

          {active === "" && <Details />}
          {active === "historial" && <Orders repeatOrder={repeatOrder} id={orderId} setMaskOn={setMaskOn} />}
          {active === "facturas" && <Bills setMaskOn={setMaskOn} />}
        </Box>
      </Wrapper>
    </Suspense>
  );
};

export default Container;
