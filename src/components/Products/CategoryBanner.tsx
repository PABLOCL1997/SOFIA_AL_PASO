import React, { FC, Suspense } from 'react';
import styled from 'styled-components';
import { BREAKPOINT, XL } from '../../utils/constants';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));

const Root = styled.div`
    padding: var(--padding);
    padding-top: 50px;
    padding-bottom: 20px;
    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 20px 20px 0 20px;
    }
    img {
        border-radius: 48px;
        width: 100%;
        height: 250px;
        object-fit: cover;
        @media screen and (max-width: ${XL}) {
            border-radius: 20px;
            height: auto;
            object-fit: unset;
        }
    }
`;

type Props = {
    category: string | undefined
}

const CategoryBanner: FC<Props> = ({ category }) => {
    return <Suspense fallback={<Loader />}>
        <Root>
            <img className="lazyload"  data-src={'/images/banner-' + category + '.jpg'} alt={'banner ' + category} />
        </Root>
    </Suspense>
}

export default CategoryBanner;