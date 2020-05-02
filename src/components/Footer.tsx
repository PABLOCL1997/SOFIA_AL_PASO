import React, { FC, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BREAKPOINT } from '../utils/constants';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Loader'));
const FooterLogo = React.lazy(() => import(/* webpackChunkName: "FooterLogo" */'./Images/FooterLogo'));
const Phone = React.lazy(() => import(/* webpackChunkName: "Phone" */'./Images/Phone'));
const Mail = React.lazy(() => import(/* webpackChunkName: "Mail" */'./Images/Mail'));

const Container = styled.div`
    background: var(--black);
    padding: 40px;
    .main-container {
        display: flex;
        flex-direction: row;
        @media screen and (max-width: ${BREAKPOINT}) {
            flex-direction: column;
        }
    }
`

const Col1 = styled.div`
    width: 50%;
    margin-right: 110px;
    @media screen and (max-width: ${BREAKPOINT}) {
        width: 100%;
        margin-right: 0;
        .copy {
            display: none;
        }
    }
`

const Col2 = styled.div`
    .copy {
        display: none;
    }
    @media screen and (max-width: ${BREAKPOINT}) {
        .copy {
            display: block;
        }
    }
`

const Text = styled.p`
    font-family: MullerBold;
    font-weight: bold;
    padding: 40px 0;
    font-size: 24px;
    line-height: 31px;
    letter-spacing: 0.015em;
    color: white;
`

const Copy = styled.p`
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.015em;
    color: white;
`

const Line = styled.div`
    margin-top: 29px;
    width: 32px;
    height: 4px;
    background: var(--red);
    border-radius: 24px;
    @media screen and (max-width: ${BREAKPOINT}) {
        margin-top: 0;
    }
`

const Slogan = styled.h2`
    font-family: MullerBold;
    font-size: 20px;
    line-height: 20px;
    letter-spacing: 0.015em;
    color: white;
    margin-top: 40px;
`

const Contact = styled.p`
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.015em;
    color: white;
    margin: 10px 0 20px;
`

const IconBox = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
`

const IconText = styled.div`
    margin-left: 10px;
    flex: 1;
`

const Line1 = styled.p`
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.015em;
    color: white;
`

type Props = {}

const Footer: FC<Props> = () => {
    const { t } = useTranslation();

    return <Suspense fallback={<Loader />}>
        <Container>
            <div className="main-container">
                <Col1>
                    <FooterLogo />
                    <Text>{t('footer.text')}</Text>
                    <Copy className="copy">{t('footer.copy', { year: new Date().getFullYear() })}</Copy>
                    <Line />
                </Col1>
                <Col2>
                    <Slogan>{t('footer.slogan')}</Slogan>
                    <Contact>{t('footer.contact')}</Contact>
                    <IconBox>
                        <Phone />
                        <IconText>
                            <Line1>{t('footer.phone')}</Line1>
                            <Line1>800124141</Line1>
                        </IconText>
                    </IconBox>
                    <IconBox>
                        <Mail />
                        <IconText>
                            <Line1>{t('footer.mail')}</Line1>
                            <Line1>info@sofia.com.bo</Line1>
                        </IconText>
                    </IconBox>
                    <Copy className="copy">{t('footer.copy', { year: new Date().getFullYear() })}</Copy>
                </Col2>
            </div>
        </Container>
    </Suspense>
}

export default Footer;