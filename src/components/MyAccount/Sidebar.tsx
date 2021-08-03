import React, { FC, Suspense, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { DETAILS, GET_USER } from '../../graphql/user/queries';
import { Link, useLocation } from "react-router-dom";
import EmployeeModal from '../EmployeeModal';
import EmployeeCard from './EmployeeCard/EmployeeCard';
import { GET_USER2E_DETAILS } from '../../graphql/b2e/queries';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const ProfileIcon = React.lazy(() => import(/* webpackChunkName: "ProfileIcon" */'../Images/ProfileIcon'));
const History = React.lazy(() => import(/* webpackChunkName: "History" */'../Images/History'));

const Name = styled.h2`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--red);
    padding: 26px;
    margin-bottom: 40px;
`

const Menu = styled.ul`
    margin-bottom: 30px;
`

const Item = styled.li<{ active: boolean }>`
    display: flex;
    align-items: center;
    padding: 8px 26px;
    margin: 10px 0;
    border-left: 2px solid ${props => props.active ? 'var(--red)' : 'transparent'};
    svg {
        path {
            stroke: ${props => props.active ? 'var(--red)' : 'var(--font)'}
        }
    }
    & > a {
        font-family: MullerMedium;
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--black);
        margin-left: 10px;
        text-decoration: none;
    }
`

type Props = {}

interface AddressEbs {
    id_direccion: number;
    id_listaPrecio: number;
    categoriaCliente: string; 
    ciudad: string;
    direccion: string;
    latitud: string;
    longitud: string; 
    provincia: string; 
    vendedor: string; 
    vhPrimerTurno: string; 
    vhSegundoTurno: string; 
}

interface AddressMagento {
    id_address_ebs: number;
    id_price_list: number;
    id: number;
    city: string;
    firstname: string;
    lastname: string;
    latitude: string;
    longitude: string;
    nit: string;
    phone: string;
    reference: string;
    street: string;
    __typename: string;
}

const Sidebar: FC<Props> = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const { data } = useQuery(DETAILS, {});
    const { data: userData } = useQuery(GET_USER, {
        // onCompleted: d => console.log('data', d)
    });
    const [getB2EDetails, { loading: loadingB2EDetails }] = useLazyQuery(GET_USER2E_DETAILS, {
        onCompleted: d => {
            // console.log('data', d.getB2EUserDetails.direcciones)
            // console.log('details', data.details.addresses)
            const addresses: number[] = data.details.addresses.filter(({ id_address_ebs }: AddressMagento) => id_address_ebs)
            // console.log('addresses', addresses)
            if (d.getB2EUserDetails && d.getB2EUserDetails.direcciones) {
                d.getB2EUserDetails.direcciones
                .filter(({ id_direccion }: AddressEbs) => !addresses.includes(id_direccion))
                .map((direccion: AddressEbs) => {
                    console.log('map', direccion)
                })
            }
        }
    })
    const [show, setShowOpen] = useState(false);
    const updateAddresses = () => {
        // if (!(data.details.employee || data.details.employee_old)) return;
        const nit = data.details.nit
        console.log(nit)
        getB2EDetails({ variables: { nit }})
    }

    return <Suspense fallback={<Loader />}>
        <>
            <Name>{data && data.details && data.details.firstname ? `${data.details.firstname} ${data.details.lastname}` : t('account.sidebar.welcome')}</Name>
            <Menu>
                <Item active={pathname.indexOf('ordenes') < 0}>
                    <ProfileIcon />
                    <Link to="/mi-cuenta">{t('account.sidebar.personal_info')}</Link>
                </Item>
                <Item active={pathname.indexOf('ordenes') >= 0}>
                    <History />
                    <Link to="/mi-cuenta/ordenes">{t('account.sidebar.history')}</Link>
                </Item>
                <Item active={false}>
                    {data && (
                    <>
                        <EmployeeCard setShowOpen={setShowOpen} cuentaActiva={data.details.employee || data.details.employee_old} />

                        <EmployeeModal
                            show={show}
                            setShowOpen={setShowOpen}
                            setCuentaActiva={data.details.employee || data.details.employee_old}
                            userDetails={data}
                            userData={userData}
                        />
                    </>
                    )}
                </Item>
                {/* cuenta activa ?  */}
                {/* {data && (data.details.employee || data.details.employee_old) && 
                    <Item active={false}>
                        No ves tus direcciones de empleado? 
                        <a href="#" onClick={updateAddresses}>Recargar direcciones</a> 
                    </Item>
                } */}
            </Menu>
        </>
    </Suspense>
}

export default Sidebar;