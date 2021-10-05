import React, { Suspense, FC, useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";

import * as SC from "./style";
import * as GSC from "../style";
import { ActivateProps } from "../props";

const Benefits: FC<ActivateProps> = ({ onNext, onBack }) => {
    const { t } = useTranslation();
    
    return (
        <GSC.Wrapper>
            <GSC.Title>{t("activate.steps.benefits.title")}</GSC.Title>
            <GSC.Square>
                <SC.BenefitList.Wrapper> 
                    <SC.BenefitList.Item.Wrapper>
                        <Gift />
                        <SC.BenefitList.Item.Title>
                            {t("activate.steps.benefits.benefits")}
                        </SC.BenefitList.Item.Title>
                    </SC.BenefitList.Item.Wrapper>
                    
                    <SC.BenefitList.Item.Wrapper>
                        <Discount />
                        <SC.BenefitList.Item.Title>
                            {t("activate.steps.benefits.discounts")}
                        </SC.BenefitList.Item.Title>
                    </SC.BenefitList.Item.Wrapper>

                    <SC.BenefitList.Item.Wrapper>
                        <Shipping />
                        <SC.BenefitList.Item.Title>
                            {t("activate.steps.benefits.shipping")}
                        </SC.BenefitList.Item.Title>
                    </SC.BenefitList.Item.Wrapper>
                </SC.BenefitList.Wrapper>
                
                <SC.Text>
                    <Trans
                        i18nKey="activate.steps.benefits.copy"
                        components={{
                            strong: <strong />
                        }}
                    />
                </SC.Text>
                <SC.CallToAction>
                    <GSC.ButtonPrimary type="button" onClick={() => onNext()}>
                        {t("activate.steps.benefits.activate")}
                    </GSC.ButtonPrimary>
                    <SC.InfoWrapper>
                        <Info />
                    </SC.InfoWrapper>
                    <SC.Info>
                        <Trans
                            i18nKey="activate.steps.benefits.warning"
                            components={{
                                sofialink: <a href="#openRegister" />
                            }}
                        />
                    </SC.Info>
                </SC.CallToAction>
            </GSC.Square>
        </GSC.Wrapper>
    )
}

export default Benefits;



const Gift = () => {
    return (
        <svg width="98" height="96" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse opacity="0.08" cx="49" cy="48" rx="49" ry="48" fill="#E30613"/>
        <path d="M69.8438 35.4561H27.9062C26.8535 35.4561 26 36.3095 26 37.3623V44.9873C26 46.0401 26.8535 46.8936 27.9062 46.8936H69.8438C70.8965 46.8936 71.75 46.0401 71.75 44.9873V37.3623C71.75 36.3095 70.8965 35.4561 69.8438 35.4561Z" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M67.938 46.8933V64.0496C67.938 64.5551 67.7372 65.04 67.3797 65.3975C67.0222 65.755 66.5373 65.9558 66.0317 65.9558H31.7192C31.2137 65.9558 30.7288 65.755 30.3713 65.3975C30.0138 65.04 29.813 64.5551 29.813 64.0496V46.8933" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M48.875 35.4561V65.9561" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M59.6584 32.7602C56.9625 35.4561 48.875 35.4561 48.875 35.4561C48.875 35.4561 48.875 27.3685 51.5708 24.6727C52.6435 23.6012 54.0978 22.9996 55.6139 23C57.1301 23.0004 58.584 23.6029 59.6561 24.675C60.7282 25.7471 61.3306 27.201 61.3311 28.7171C61.3315 30.2333 60.7298 31.6875 59.6584 32.7602V32.7602Z" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M38.0911 32.7602C40.787 35.4561 48.8745 35.4561 48.8745 35.4561C48.8745 35.4561 48.8745 27.3685 46.1787 24.6727C45.106 23.6012 43.6517 22.9996 42.1356 23C40.6194 23.0004 39.1655 23.6029 38.0934 24.675C37.0214 25.7471 36.4189 27.201 36.4185 28.7171C36.418 30.2333 37.0197 31.6875 38.0911 32.7602V32.7602Z" stroke="#E30613" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

const Discount = () => {
    return (
        <svg width="98" height="96" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse opacity="0.08" cx="49" cy="48" rx="49" ry="48" fill="#E30613"/>
        <path d="M38 64L60 32" stroke="#E30613" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round"/>
        <path d="M39 43C42.3137 43 45 40.0899 45 36.5C45 32.9101 42.3137 30 39 30C35.6863 30 33 32.9101 33 36.5C33 40.0899 35.6863 43 39 43Z" stroke="#E30613" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round"/>
        <path d="M59 66C62.3137 66 65 63.0899 65 59.5C65 55.9101 62.3137 53 59 53C55.6863 53 53 55.9101 53 59.5C53 63.0899 55.6863 66 59 66Z" stroke="#E30613" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round"/>
        </svg>
    )
}

const Shipping = () => {
    return (
        <svg width="98" height="96" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse opacity="0.08" cx="49" cy="48" rx="49" ry="48" fill="#E30613"/>
        <path d="M32.6125 40.4632V41.7132H35.1125V40.4632H32.6125ZM33.8625 36.5974V35.3474H32.6125V36.5974H33.8625ZM65.4965 36.5974H66.7465V35.3474H65.4965V36.5974ZM65.4965 63.6579V64.9079H66.7465V63.6579H65.4965ZM33.8625 63.6579H32.6125V64.9079H33.8625V63.6579ZM35.1125 59.7921C35.1125 59.1018 34.5529 58.5421 33.8625 58.5421C33.1722 58.5421 32.6125 59.1018 32.6125 59.7921H35.1125ZM35.1125 40.4632V36.5974H32.6125V40.4632H35.1125ZM33.8625 37.8474H65.4965V35.3474H33.8625V37.8474ZM64.2465 36.5974V63.6579H66.7465V36.5974H64.2465ZM65.4965 62.4079H33.8625V64.9079H65.4965V62.4079ZM35.1125 63.6579V59.7921H32.6125V63.6579H35.1125Z" fill="#E30613"/>
        <path d="M22 52.7434H20.75V55.2434H22V52.7434ZM37.817 55.2434C38.5073 55.2434 39.067 54.6838 39.067 53.9934C39.067 53.3031 38.5073 52.7434 37.817 52.7434V55.2434ZM22 55.2434H37.817V52.7434H22V55.2434Z" fill="#E30613"/>
        <path d="M25.9541 45.0118H24.7041V47.5118H25.9541V45.0118ZM41.7711 47.5118C42.4614 47.5118 43.0211 46.9522 43.0211 46.2618C43.0211 45.5715 42.4614 45.0118 41.7711 45.0118V47.5118ZM25.9541 47.5118H41.7711V45.0118H25.9541V47.5118Z" fill="#E30613"/>
        <path d="M55.611 30.7987H56.861H55.611ZM54.361 36.5974C54.361 37.2877 54.9207 37.8474 55.611 37.8474C56.3014 37.8474 56.861 37.2877 56.861 36.5974H54.361ZM44.9983 36.5974V30.7987H42.4983V36.5974H44.9983ZM44.9983 30.7987C44.9983 29.6015 45.4845 28.4476 46.3594 27.5922L44.6117 25.8046C43.2619 27.1242 42.4983 28.92 42.4983 30.7987H44.9983ZM46.3594 27.5922C47.2352 26.7359 48.4291 26.25 49.6797 26.25V23.75C47.784 23.75 45.9605 24.4859 44.6117 25.8046L46.3594 27.5922ZM49.6797 26.25C50.9302 26.25 52.1241 26.7359 52.9999 27.5922L54.7476 25.8046C53.3988 24.4859 51.5753 23.75 49.6797 23.75V26.25ZM52.9999 27.5922C53.8748 28.4476 54.361 29.6015 54.361 30.7987H56.861C56.861 28.92 56.0974 27.1242 54.7476 25.8046L52.9999 27.5922ZM54.361 30.7987V36.5974H56.861V30.7987H54.361Z" fill="#E30613"/>
        </svg>
    )
}


const Info = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 16C3.6 16 0 12.4 0 8C0 3.6 3.6 0 8 0C12.4 0 16 3.6 16 8C16 12.4 12.4 16 8 16ZM8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2Z" fill="#E30613"/>
        <path d="M9 12H7V7H9V12Z" fill="#E30613"/>
        <path d="M8 4C8.55228 4 9 4.44772 9 5C9 5.55228 8.55228 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4Z" fill="#E30613"/>
        </svg>
    )
}