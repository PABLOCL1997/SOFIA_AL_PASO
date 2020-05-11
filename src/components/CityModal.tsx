import React, { FC, Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { KeyValue } from '../utils/string';
import { BREAKPOINT } from '../utils/constants';
import { useMutation, useQuery } from 'react-apollo';
import { SET_USER } from '../graphql/user/mutations';
import { GET_USER } from '../graphql/user/queries';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Loader'));
const WorldPin = React.lazy(() => import(/* webpackChunkName: "WorldPin" */'./Images/WorldPin'));

const Courtain = styled.div<any>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,.2);
    z-index: 2;
    &.visible {
        display: flex;
    }
`

const Modal = styled.div`
    background: white;
    border-radius: 10px;
    padding: 50px;
    text-align: center;
    @media screen and (max-width: ${BREAKPOINT}) {
        margin: 0 20px;
        padding: 20px 40px;
    }
`

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 24px;
    line-height: 24px;
    color: var(--black);
    margin: 20px 0;
`

const Text = styled.p`
    font-size: 14px;
    line-height: 142%;
    text-align: center;
    letter-spacing: 0.02em;
    color: var(--font);
    max-width: 400px;
    margin-bottom: 30px;
`

const Radios = styled.div`
    text-align: left;
    max-width: fit-content;
    margin: 0 auto;
`

const RadionGroup = styled.div<any>`
    padding: 5px 10px;
    border-radius: 30px;
    margin-top: 10px;   
    border: 1px solid transparent;
    cursor: pointer;
    &.selected {
        border: 1px solid var(--red);
    }
    input {
        cursor: pointer;
        -webkit-appearance: none;
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        border-radius: 100%;
        border: 1px solid var(--red);
        &:checked {
            background: var(--red);
            box-shadow: 0 0 0 3px white inset;
        }
    }
    label {
        cursor: pointer;
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        color: var(--red);
        margin-left: 10px;
    }
`

type Props = {}

type User = {
    cityKey?: String,
    cityName?: String,
    openCityModal?: Boolean
}

const CityModal: FC<Props> = () => {
    const { t } = useTranslation();
    const { data } = useQuery(GET_USER, {});
    const [city, setCity] = useState<User>({});
    const [setUser] = useMutation(SET_USER, { variables: { user: city } });
    const [toggleCityModal] = useMutation(SET_USER, { variables: { user: { openCityModal: false } } });

    const cities: Array<KeyValue> = [
        { key: 'CB', value: 'Cochabamba' },
        { key: 'LP', value: 'La Paz' },
        { key: 'SC', value: 'Santa Cruz' },
        { key: 'EA', value: 'El Alto' }
    ];

    const changeCity = (c: KeyValue) => {
        setCity({
            cityKey: c.key,
            cityName: c.value,
            openCityModal: false
        })
    }

    useEffect(() => {
        if (data.userInfo.length && data.userInfo[0].cityKey) toggleCityModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (city.cityKey) setUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city]);

    return <Suspense fallback={<Loader />}>
        <Courtain className={(!data.userInfo.length || !data.userInfo[0].cityKey || data.userInfo[0].openCityModal) && 'visible'}>
            <Modal>
                <WorldPin />
                <Title>{t('citymodal.title')}</Title>
                <Text>{t('citymodal.text')}</Text>
                <Radios>
                    {cities.map((c: KeyValue) => <RadionGroup className={data.userInfo.length && data.userInfo[0].cityKey === c.key && 'selected'} onClick={() => changeCity(c)} key={c.key}>
                        <input readOnly id={`city${c.key}`} name="city" type="radio" checked={!!(data.userInfo.length && data.userInfo[0].cityKey === c.key)} />
                        <label>{c.value}</label>
                    </RadionGroup>)}
                </Radios>
            </Modal>
        </Courtain>
    </Suspense>
}

export default CityModal;