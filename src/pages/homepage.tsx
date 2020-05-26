import React, { Suspense, FC, useEffect } from 'react';
import styled from 'styled-components';
import { BREAKPOINT } from '../utils/constants';
import { HOMEPAGE_TITLE } from '../meta';
import DelayedWrapper from '../components/DelayedWrapper';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const Hero = React.lazy(() => import(/* webpackChunkName: "Hero" */'../components/Homepage/Hero'));
const CategorySlider = React.lazy(() => import(/* webpackChunkName: "CategorySlider" */'../components/Homepage/CategorySlider'));
const Benefits = React.lazy(() => import(/* webpackChunkName: "Benefits" */'../components/Homepage/Benefits'));
const Promotions = React.lazy(() => import(/* webpackChunkName: "Promotions" */'../components/Homepage/Promotions'));
const Recipes = React.lazy(() => import(/* webpackChunkName: "Recipes" */'../components/Homepage/Recipes'));
const Subscribe = React.lazy(() => import(/* webpackChunkName: "Subscribe" */'../components/Homepage/Subscribe'));

const SectionWrapper = styled.div`
    margin-bottom: 88px;
    @media screen and (max-width: ${BREAKPOINT}) {
        margin-bottom: 30px;
    }
`

type Props = {}
const Homepage: FC<Props> = () => {

    useEffect(() => {
        document.title = HOMEPAGE_TITLE;
    }, [])

    return (
        <Suspense fallback={<Loader />}>
            <DelayedWrapper>
                <SectionWrapper>
                    <Hero />
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
            </DelayedWrapper>
        </Suspense>
    );
}

export default Homepage;
