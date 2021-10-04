import { useQuery } from "@apollo/react-hooks";
import React from "react";
import styled from "styled-components";
import { GET_PAGES } from "../graphql/metadata/queries";


const Wrapper = styled.div`
  margin: 45px 0;
  display: flex;
  align-items: center;
  justify-content: center;

`

const Incentivos = () => {
    const { data } = useQuery(GET_PAGES, {
        fetchPolicy: "network-only",
        variables: { identifier: "sap-incentivos-meses" }
    });
    return (
        <Wrapper>
            {data && data.pages && data.pages.length > 0 && data.pages[0].content
            && <div dangerouslySetInnerHTML={{ __html: data.pages[0].content }} />}
        </Wrapper>
    )
}

export default Incentivos