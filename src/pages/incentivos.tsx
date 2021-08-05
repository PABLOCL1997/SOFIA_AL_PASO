import React from "react";
import styled from "styled-components";


const Wrapper = styled.div`
  margin: 45px 0;
  display: flex;
  align-items: center;
  justify-content: center;

`

const Incentivos = () => {
    return (
        <Wrapper>
            <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSffctnxI8fhEcRG-Etr6BzesA0Rovzi7-_Jxmt2ytfyq8xT-Q/viewform?embedded=true"
                width="800"
                height="1500"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
            >
                Loading…
            </iframe>
        </Wrapper>
    )
}

export default Incentivos