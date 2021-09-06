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
                src="https://docs.google.com/forms/d/e/1FAIpQLSd1oE0O5SKuCYO3fA7SkDlfCcgxXLvmQxhrIWAw4JCoZALVvQ/viewform?embedded=true"
                width="800"
                height="1200"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}>
                    Loading…
            </iframe>
        </Wrapper>
    )
}

export default Incentivos