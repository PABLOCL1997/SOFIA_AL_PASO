import React, { FC, Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BREAKPOINT } from '../../utils/constants';
import { setLatLng } from '../../utils/googlemaps';
import { useQuery } from 'react-apollo';
import { DETAILS } from '../../graphql/user/queries';
import { AddressType } from '../../graphql/user/type';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const Map = React.lazy(() => import(/* webpackChunkName: "Map" */'../Map'));
const Switch = React.lazy(() => import(/* webpackChunkName: "Switch" */'../Switch'));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */'../Images/Chevron'));

const Container = styled.div``

const Title = styled.div`
    display: flex;
    margin-bottom: 30px;
    h2 {
        font-family: MullerMedium;
        font-size: 16px;
        line-height: 16px;
        color: var(--red);
        flex: 1;
    }
    span {
        font-family: MullerMedium;
        font-size: 12px;
        line-height: 12px;
        color: var(--black);
    }
    @media screen and (max-width: ${BREAKPOINT}) {
        flex-direction: column;
        span {
            margin-top: 10px;
        }
    }
`

const Form = styled.div<{ hidden: boolean }>`
    display: ${props => props.hidden ? 'none' : 'grid'};
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 30px;
    @media screen and (max-width: ${BREAKPOINT}) {
        grid-template-columns: 1fr;
        column-gap: 0;
    }
`

const InputGroup = styled.div<{ key: string, withLabel: boolean }>`
    display: flex;
    flex-direction: column;
    label {
        font-family: MullerMedium;
        font-size: 10px;
        line-height: 10px;
        letter-spacing: 0.01em;
        text-transform: uppercase;
        color: var(--font);
        padding-left: 20px;
        opacity: ${props => props.withLabel ? '1' : '0'}
    }
    input {
        background: var(--whiter);
        border-radius: 44px;
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        align-items: center;
        letter-spacing: 0.01em;
        color: var(--font);
        padding: 12px 20px;
        border: 0;
        margin-top: 10px;
    }
`

const Other = styled.button<{ margin: boolean }>`
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    text-decoration-line: underline;
    color: var(--red);
    border: 0;
    background: none;
    margin: 20px 0 ${props => props.margin ? '40px' : '0'};
    &:hover {
        opacity: .8;
    }
`

const CheckboxGroup = styled.div<{ red: boolean }>`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    input {
        -webkit-appearance: none;
        border: 2px solid var(--${props => props.red ? 'red' : 'font'});
        border-radius: 4px;
        width: 20px;
        height: 20px;
        cursor: pointer;
        &:checked {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAqCAYAAAD1T9h6AAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJsSURBVHgB1ZhRbtNAEIZn13FA4sVqi8RDIrU3SG9QH6EnQJwAeOONcoLCSSJOkN6gvQEVzhtN8SPUjpcdU1Vpas/O2rvx9pMsRd6J/Y9n91+PAZ4BPyA5zOL9hT5+Z+N9pY85nsMxAYGDQkdxdKmVJltDeXm3Po4gYFB8PI4WWvybhuGXUspZsBXQ4hMt/lIBHBJhuYRA0dNmbhCPJEEm8DPeO9fT5sQUpxP8HtwUysYHn7W0M2OgUnkZVcdBJZDFe+9BiK+s4Eqk0/LmYgSBkI2SE654IcTHiRaPv4NIoN6URDTnRasvk7+rh0QH3wcMXv8YBd+mxe2nzVODrgGm1/9HwcW0WKXbpwe1UabX66esrstX69OmscES4Ho9ii9klR7led48PgC2Xn/0J79uC9l5Al28ngrZqY129XqKnSXQx+spdrIP9PV6Cu9rwIXXU8j7m7T2nH1x4fXk/6ieUyiZTopfV9AR9Hq9GD+Y4h68nrDLNuRoHJ03iEcSJarFMn49gw6g13PEo9d3FY8InDKGGOtKuPZ6ColPwBBjVQlbr+8jHtGLWHCeLCsJe6+/4VWJQJbR+h2jCgiZxIbXJ8Yrodff3Z6BA+p9YBknMwVS31yYb96wJnx7PUW9D0yK/EpAlXathG+vp6+5QZdKVLB+69vr6etuYZkED8Z7fVeedGSW04mHkqc+xCONLaXLJFx4PUVrT+wmCTdeT2F8ne68Jur3+pX5XagnrH7AOgnHXk/B+qxiM518eD0F+7sQJwnTNxwfWLeUrdPJo9dTWH+Za62ER6/3AlZCNy51D718ceDdbbyASQwt/h8riHszQZr28wAAAABJRU5ErkJggg==');
            background-position: center center;
            background-size: 12px;
            background-repeat: no-repeat;
        }
    }
    label {
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        color: var(--font);
        padding-left: 10px;
        cursor: pointer;
    }
`

const SelectWrapper = styled.div`
    position: relative;
    cursor: pointer;

    select {
        -webkit-appearance: none;
        width: 100%;
        background: var(--whiter);
        border-radius: 44px;
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        align-items: center;
        letter-spacing: 0.01em;
        color: var(--font);
        padding: 10px 20px;
        border: 0;
        margin-top: 10px;
        cursor: pointer;
    }

    svg {
        pointer-events: none;
        position: absolute;
        top: 24px;
        right: 20px;
        path {
            stroke: var(--red);
        }
    }
`

type Props = {
    updateOrder: Function
}

const Shipping: FC<Props> = ({ updateOrder }) => {
    const { t } = useTranslation();
    const [inputs, setInputs] = useState<any>({ addressType: t('checkout.delivery.street') });
    const [other, setOther] = useState(false);
    const { data: userData } = useQuery(DETAILS, {
        fetchPolicy: 'network-only'
    });

    const onChange = (key: string, value: string | number | null) => {
        setInputs({
            ...inputs,
            [key]: value
        })
        if (key === 'city' && value) setLatLng(String(value));
    }

    const selectAddress = (address: AddressType) => {
        if (address) {
            onChange('addressId', Number(address.id));
            updateOrder('shipping', address);
            setOther(false);
        }
    }

    const showOther = () => {
        setOther(true);
        onChange('addressId', null);
    }

    const addressTypes = [
        {
            title: t('checkout.delivery.street'),
            value: t('checkout.delivery.street')
        },
        {
            title: t('checkout.delivery.avenue'),
            value: t('checkout.delivery.avenue')
        }
    ];

    const options: { [key: string]: Array<string> } = {
        city: ["Cochabamba", "El Alto", "La Paz", "Santa Cruz"],
        home_type: ["Casa", "Departamento"]
    };

    useEffect(() => {
        if (userData && userData.details.addresses) selectAddress(userData.details.addresses[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    useEffect(() => {
        if (!inputs.addressId) updateOrder('shipping', inputs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputs]);

    return <Suspense fallback={<Loader />}>
        <Container>
            <Title>
                <h2>{t('checkout.delivery.title')}</h2>
                <span>{t('checkout.delivery.time', { day: '', from: '', to: '' })}</span>
            </Title>
            {userData && userData.details.addresses && userData.details.addresses.map((address: AddressType) => <CheckboxGroup red={!other} key={address.id}>
                <input type="radio" checked={Number(address.id) === Number(inputs.addressId)} id={'address' + address.id} name="addressId" value={address.id} onChange={() => selectAddress(address)} />
                <label onClick={() => selectAddress(address)}>{address.street}</label>
            </CheckboxGroup>)}
            <Other margin={!!other} onClick={showOther}>{t('checkout.delivery.other_address')}</Other>
            <Form hidden={!other}>
                {['firstname', 'lastname', 'phone', 'nit', 'city', 'street', 'address', 'number', 'home_type', 'apt_number', 'building_name', 'reference'].map((key: string) => {
                    return <InputGroup withLabel={key !== 'street'} key={key}>
                        <label>{t('checkout.delivery.' + key)}</label>
                        {options[key] && <SelectWrapper>
                            <select onChange={evt => onChange(key, evt.target.value)}><option value="">{t('checkout.delivery.' + key)}</option>{options[key].map((opt: string) => <option key={opt}>{opt}</option>)}</select>
                            <Chevron />
                        </SelectWrapper>}
                        {key === 'street' && <Switch changeOption={(value: string) => onChange('addressType', value)} option={inputs.addressType} values={addressTypes} />}
                        {key !== 'street' && !options[key] && <input onChange={evt => onChange(key, evt.target.value)} type="text" placeholder={t('checkout.delivery.' + key)} />}
                    </InputGroup>
                })}
            </Form>
            {other && <Map />}
        </Container>
    </Suspense>
}

export default Shipping;