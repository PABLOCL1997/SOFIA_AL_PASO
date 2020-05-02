import React, { Suspense, FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import Subscribe from '../components/Homepage/Subscribe';
import { user } from '../utils/store';
import { BREAKPOINT } from '../utils/constants';
import { HOMEPAGE_TITLE } from '../meta';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const CityModal = React.lazy(() => import(/* webpackChunkName: "CityModal" */'../components/CityModal'));
const Hero = React.lazy(() => import(/* webpackChunkName: "Hero" */'../components/Homepage/Hero'));
const CategorySlider = React.lazy(() => import(/* webpackChunkName: "CategorySlider" */'../components/Homepage/CategorySlider'));
const Benefits = React.lazy(() => import(/* webpackChunkName: "Benefits" */'../components/Homepage/Benefits'));
const Promotions = React.lazy(() => import(/* webpackChunkName: "Promotions" */'../components/Homepage/Promotions'));
const Recipes = React.lazy(() => import(/* webpackChunkName: "Recipes" */'../components/Homepage/Recipes'));
const Wrapper = styled.div`
`

const SectionWrapper = styled.div`
    margin-bottom: 88px;
    @media screen and (max-width: ${BREAKPOINT}) {
        margin-bottom: 30px;
    }
`

type Props = {}
const Homepage: FC<Props> = () => {
    const _user = user.get();
    const [open, setOpen] = useState(!_user.address);

    useEffect(() => {
        document.title = HOMEPAGE_TITLE;
    }, [])

    return (
        <Suspense fallback={<Loader />}>
            <Wrapper>
                <CityModal open={open} />
                <SectionWrapper>
                    <Hero setOpen={setOpen} />
                </SectionWrapper>
                <SectionWrapper>
                    <CategorySlider />
                </SectionWrapper>
                <SectionWrapper>
                    <Benefits />
                </SectionWrapper>
                <SectionWrapper>
                    <Promotions />
                </SectionWrapper>
                <SectionWrapper>
                    <Subscribe />
                </SectionWrapper>
                <Recipes />
            </Wrapper>
        </Suspense>
    );
}

export default Homepage;
