import React, { FC } from "react"
import * as SC from "./style";
import logo from "../../../assets/activate/whatsapp-logo.png"

interface Props {
  link: string;
  title: string;
}
const WhatsAppLogo: FC<Props> = ({ link, title }) => {
  return (
    <SC.Link href={link} target="_blank">
      <SC.LogoWhatsApp.Wrapper>
        <SC.LogoWhatsApp.Img src={logo} alt="logo_whatsapp"/>
        <SC.LogoWhatsApp.Title>{title}</SC.LogoWhatsApp.Title>
      </SC.LogoWhatsApp.Wrapper>
    </SC.Link>
  )
}

export default WhatsAppLogo;