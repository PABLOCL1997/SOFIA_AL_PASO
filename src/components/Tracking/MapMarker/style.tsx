import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
`;

export const Marker = styled.div<{isPin: boolean}>`
  position: relative;
  width: 40px;
  height: 40px;
  transform: ${props => props.isPin ? "translate(-20px, -40px)": "translate(-20px, -20px)"} ;

  .bounce {
    animation-name: bounce;
    animation-fill-mode: both;
    animation-duration: 1s;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @keyframes bounce {
    0% {
      opacity: 0;
      transform: translateY(-2000px) rotate(0);
    }

    60% {
      opacity: 1;
      transform: translateY(30px) rotate(0);
    }

    80% {
      transform: translateY(-10px) rotate(0);
    }

    100% {
      transform: translateY(0) rotate(0);
    }
  }
`;