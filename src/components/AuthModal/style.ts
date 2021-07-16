import styled from "styled-components";

export const ModalCourtain = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100vh;
background: rgba(0, 0, 0, 0.3);
z-index: 400;
display: none;
flex-direction: column;
align-items: center;
justify-content: center;
&.visible {
  display: flex;
}
`;

export const Modal = styled.div`
position: relative;
padding: 42px;
background: white;
border-radius: 20px;
display: flex;
flex-direction: column;
align-items: center;
min-width: 380px;
max-width: 100%;

input {
  background: var(--f-gray);
  border-radius: 44px;
  width: calc(100% - 60px);
  border: 0;
  padding: 15px 30px;
  margin-bottom: 20px;
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.01em;
  color: var(--font);
}
`;

export const CloseWrapper = styled.div`
position: absolute;
top: 15px;
right: 15px;
cursor: pointer;
&:hover {
  opacity: 0.8;
}
> svg {
  width: 12px;
  height: 12px;
}
`;

export const Title = styled.h2`
font-family: MullerMedium;
font-size: 24px;
line-height: 24px;
color: var(--black);
margin-bottom: 20px;
`;

export const Description = styled.p`
font-family: MullerMedium;
font-size: 12px;
line-height: 137%;
letter-spacing: 0.01em;
color: var(--font);
margin-bottom: 20px;
max-width: 250px;
text-align: center;
`;

export const Link = styled.span<{ position?: string }>`
font-size: 12px;
line-height: 12px;
letter-spacing: 0.01em;
text-decoration-line: underline;
color: var(--red);
cursor: pointer;
display: ${props => (props.position ? "block" : "inline-block")};
width: 100%;
text-align: ${props => (props.position ? props.position : "left")};
margin-bottom: 20px;
&:hover {
  opacity: 0.8;
}
`;

export const CtaWrapper = styled.div`
width: 100%;
button {
  width: 100%;
  padding: 15px 30px;
  text-transform: uppercase;
}
margin-bottom: 20px;
`;

export const Line = styled.div`
border-bottom: 2px solid rgba(0, 0, 0, 0.11);
width: 100%;
margin-bottom: 20px;
`;

export const SocialButton = styled.button<{ network: string }>`
width: 190px;
border: 1px solid var(--${props => props.network});
background: white;
padding: 10px 20px;
display: flex;
align-items: center;
border-radius: 20px;
margin-bottom: 20px;
transition: all 0.3s linear;
svg {
  margin-right: 10px;
}
span,
b {
  font-size: 12px;
  line-height: 12px;
  color: var(--${props => props.network});
}
b {
  font-family: MullerBold;
  margin-left: 5px;
}
&:hover {
  background: var(--${props => props.network});
  * {
    filter: brightness(100);
  }
}
`;

export const Disclaimer = styled.div`
font-size: 12px;
line-height: 12px;
display: flex;
align-items: center;
text-align: center;
letter-spacing: 0.01em;
color: var(--black);

span {
  width: auto;
  margin-bottom: 0;
  margin-right: 5px;
}
`;

export const LoaderWrapper = styled.div`
position: absolute;
background: white;
left: 0;
top: 0;
height: 100%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
z-index: 1;
border-radius: 20px;
img {
  width: 50px;
}
`;
export const LoginError = styled.div`
font-size: 12px;
color: var(--red);
max-width: 250px;
margin-bottom: 15px;
margin-left:-15px; 
`;

export const PasswordWrapper = styled.div`
position: relative;
display: flex;
width: 100%;

svg {
  position: absolute;
  top: 15%;
  right: 15px;

  cursor: pointer;
}
`
