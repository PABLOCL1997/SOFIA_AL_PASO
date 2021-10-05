import React, { Suspense, FC, useEffect, useState } from "react";
import { useTranslation, Trans, UseTranslationOptions } from "react-i18next";

import * as SC from "./style";
import * as GSC from "../style";
import { ActivateProps } from "../props";

const Map = React.lazy(() => import(/* webpackChunkName: "Map" */ "../../Map"));

interface Props {
    street: string;
    phone: string;
    city: string;
    latitude: string;
    longitude: string;
    setStreet: Function;
    setPhone: Function;
    setLatitude: Function;
    setLongitude: Function;
}

const ModifyAddress: FC<ActivateProps & Props> = ({
        onBack,
        onNext,
        street,
        setStreet,
        phone,
        setPhone,
        city,
        latitude,
        setLatitude,
        longitude,
        setLongitude,

    }) => {
    const { t } = useTranslation('', { keyPrefix: 'activate.steps.modify_address' } as UseTranslationOptions);

    const [editAddress, setEditAddress] = useState<boolean>(false);
    const [editPhone, setEditPhone] = useState<boolean>(false);

    useEffect(() => {
        (window as any).latitude = latitude;
        (window as any).longitude = longitude;      
    }, [])
    
    const handleNext = () => {
        setLatitude(String((window as any).latitude));
        setLongitude(String((window as any).longitude));
        
        onNext();
    }

    const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStreet(e.target.value);
    }

    const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    }

    return (
        <GSC.Wrapper>
            <GSC.Title>
                {t("title")}
            </GSC.Title>
            <GSC.Square>
                <Check />

                <GSC.Instructions.Wrapper>
                    <GSC.Instructions.Title>
                        <Trans
                            i18nKey={t("instructions")}
                            components={{ strong: <strong /> }}
                        />

                    </GSC.Instructions.Title>
                </GSC.Instructions.Wrapper>

                <SC.Inputs.Wrapper>
                    <SC.Inputs.Address.Wrapper>
                        <SC.Inputs.Address.Label>{t("labels.address")}</SC.Inputs.Address.Label>
                        <SC.Inputs.Address.Input onChange={e => onChangeAddress(e)} readOnly={!editAddress} value={street} placeholder={t("labels.address")} />
                        <SC.Inputs.Address.Pin>
                            <Pin />
                        </SC.Inputs.Address.Pin>
                        <SC.Inputs.Address.Icon onClick={() => setEditAddress(!editAddress)}>
                            <Edit />
                        </SC.Inputs.Address.Icon>
                    </SC.Inputs.Address.Wrapper>
                    <SC.Inputs.Input.Wrapper>
                        <SC.Inputs.Input.Label>{t("labels.phone")}</SC.Inputs.Input.Label>
                        <SC.Inputs.Input.Input onChange={e => onChangePhone(e)} readOnly={!editPhone} value={phone} placeholder={t("labels.phone")} />
                        <SC.Inputs.Input.Icon onClick={() => setEditPhone(!editPhone)} >
                            <Edit />
                        </SC.Inputs.Input.Icon>
                    </SC.Inputs.Input.Wrapper>
                    <SC.Inputs.Input.Wrapper>
                        <SC.Inputs.Input.Label>{t("labels.city")}</SC.Inputs.Input.Label>
                        <SC.Inputs.Input.Input readOnly value={city} placeholder={t("labels.city")} />
                    </SC.Inputs.Input.Wrapper>

                </SC.Inputs.Wrapper>
                <SC.Map.Wrapper>
                    <Map />
                </SC.Map.Wrapper>
                <SC.CallToAction>
                    <GSC.ButtonPrimary onClick={() => handleNext()}>
                        {t("next")}
                    </GSC.ButtonPrimary>
                </SC.CallToAction>
            </GSC.Square>
        </GSC.Wrapper>
    )
    
}

export default ModifyAddress;


const Check = () => {
    return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.8335 25.8333L21.5002 34.5L38.8335 17.1666" stroke="#01B368" stroke-width="3" stroke-miterlimit="10" stroke-linecap="square"/>
        <path d="M25.8333 49.6667C38.9961 49.6667 49.6667 38.9961 49.6667 25.8333C49.6667 12.6705 38.9961 2 25.8333 2C12.6705 2 2 12.6705 2 25.8333C2 38.9961 12.6705 49.6667 25.8333 49.6667Z" stroke="#01B368" stroke-width="3" stroke-miterlimit="10" stroke-linecap="square"/>
        </svg>
    )
}

const Edit = () => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.075 2.625L0.225 8.475C0.075 8.625 0 8.775 0 9V11.25C0 11.7 0.3 12 0.75 12H3C3.225 12 3.375 11.925 3.525 11.775L9.375 5.925L6.075 2.625Z" fill="#808080"/>
        <path d="M11.775 2.475L9.525 0.225C9.225 -0.075 8.775 -0.075 8.475 0.225L7.125 1.575L10.425 4.875L11.775 3.525C12.075 3.225 12.075 2.775 11.775 2.475Z" fill="#808080"/>
        </svg>
    )
}

const Pin = () => {
    return (
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.04917 0C3.12177 0 0 3.09525 0 6.98927C0 8.88636 0.704917 10.6836 2.11475 11.9816C2.21545 12.0814 6.24355 15.6759 6.34425 15.7758C6.74706 16.0753 7.35127 16.0753 7.65338 15.7758C7.75408 15.6759 11.8829 12.0814 11.8829 11.9816C13.2927 10.6836 13.9976 8.88636 13.9976 6.98927C14.0983 3.09525 10.9766 0 7.04917 0ZM7.04917 8.9862C5.94144 8.9862 5.03512 8.08758 5.03512 6.98927C5.03512 5.89095 5.94144 4.99233 7.04917 4.99233C8.15689 4.99233 9.06321 5.89095 9.06321 6.98927C9.06321 8.08758 8.15689 8.9862 7.04917 8.9862Z" fill="#E30613"/>
        </svg>
    )
}