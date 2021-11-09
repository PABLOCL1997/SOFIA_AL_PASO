import { useState } from "react";
import { useQuery } from "react-apollo";
import { GET_BANNERS } from "../graphql/metadata/queries";

const useBanners = () => {
  const [banners, setBanners] = useState([]);

  useQuery(GET_BANNERS, {
    fetchPolicy: "network-only",
    variables: {
      mobile: window.innerWidth < 768,
    },
    onCompleted: (d) => {
      setBanners(d.banners);
    },
  });

  return banners;
};

export default useBanners;
