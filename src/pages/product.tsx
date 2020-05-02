import React, { Suspense, FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, Link, useParams } from "react-router-dom";
import { user } from '../utils/store';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { GET_PRODUCT } from '../graphql/products/queries';
import { ADD_ITEM } from '../graphql/cart/mutations';
import { PRODUCT_TITLE } from '../meta';
import { fromLink, toLink } from '../utils/string';
import { ProductType } from '../graphql/products/type';
import { CategoryType } from '../graphql/categories/type';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */'react-slick'));
const RelatedProducts = React.lazy(() => import(/* webpackChunkName: "RelatedProducts" */'../components/Product/RelatedProducts'));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */'../components/Images/Chevron'));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */'../components/Cta'));
const FreeDelivery = React.lazy(() => import(/* webpackChunkName: "FreeDelivery" */'../components/Images/FreeDelivery'));
const Quality = React.lazy(() => import(/* webpackChunkName: "Quality" */'../components/Images/Quality'));
const ContinueArrow = React.lazy(() => import(/* webpackChunkName: "ContinueArrow" */'../components/Images/ContinueArrow'));

const Header = styled.div`
    padding: var(--padding);
    display: flex;
    justify-content: flex-end;
`

const HeaderLink = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
        font-size: 16px;
        line-height: 16px;
        color: var(--red);
        margin-right: 10px;
        cursor: pointer;
    }
    svg {
        cursor: pointer;
    }
`

const Wrapper = styled.div`
    padding: var(--padding);
    display: flex;
`

const Col1 = styled.div`
    width: calc(50% - 8px);
    margin-right: 16px;
    .slick-dots {
        bottom: -5px;
        li {
            background: var(--btn-background);
            box-shadow: 0 0 0 1px var(--black);
            border-radius: 20px;
            width: 12px;
            height: 12px;
            opacity: .35;
            * { opacity: 0 }
        }
        .slick-active {
            box-shadow: 0 0 0 1px var(--btn-background);
            opacity: 1;
        }
    }
`

const Col2 = styled.div`
    flex: 1;
`

const Image = styled.div<{ src: string }>`
    height: 354px;
    background: url(${props => props.src}) no-repeat center center / contain;
`

const ProductTitle = styled.h1`
    font-family: MullerBold;
    font-size: 30px;
    line-height: 30px;
    color: var(--black);
    margin-bottom: 16px;
`

const Price = styled.div`
    font-size: 24px;
    line-height: 24px;
    color: var(--red);
    margin-bottom: 58px;
`

const ProductText = styled.ul`
    li {
        font-size: 14px;
        line-height: 14px;
        color: black;
        margin-bottom: 14px;
        &:before {
            content: "\\2022";
            color: var(--red);
            font-weight: bold;
            font-size: 30px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
        }
    }
`

const Categories = styled.div`
    margin: 25px 0;
    display: flex;
    align-items: center;
    span {
        font-family: MullerMedium;
        font-size: 10px;
        line-height: 10px;
        color: var(--black);
        margin-right: 5px;
    }
    a {
        font-family: MullerMedium;
        font-size: 10px;
        line-height: 10px;
        text-decoration-line: underline;
        color: var(--red);
        &:hover {
            opacity: .8;
        }
    }
`

const Toolbox = styled.div`
    display: flex;
    margin: 24px 0 50px;
    button {
        padding: 11px 80px;
        margin-left: 20px;
    }
`

const Qty = styled.div`
    position:relative;
    display: flex;
    align-items: center;
    border: 1px solid var(--yellow);
    border-radius: 20px;
    padding: 15px;
    select {
        cursor: pointer;
        -webkit-appearance: none;
        background: none;
        border: 0;
        width: 40px;
        padding-left: 10px;
        font-size: 12px;
        line-height: 12px;
    }
    svg {
        pointer-events: none;
        position: absolute;
        right: 15px;
    }
`

const DeliveryBox = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 25px;
`

const Text = styled.div`
    font-size: 12px;
    line-height: 12px;
    color: var(--font);
    margin-top: 5px; 
`

const Title = styled.div`
    margin-left: 10px;
    span {
        font-family: MullerBold;
        font-size: 12px;
        line-height: 12px;
        color: var(--black);  
    }
`

const Disclaimer = styled.div`
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 18px;
    color: var(--black); `

type Props = {}
const Product: FC<Props> = () => {
    let { prodname } = useParams();
    prodname = fromLink(prodname || '');
    const settings = {
        dots: true,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const { t } = useTranslation();
    const history = useHistory();
    const _user = user.get();
    const [product, setProduct] = useState<ProductType | any>({});
    const [categories, setCategories] = useState<Array<CategoryType>>([]);
    const [related, setRelated] = useState<Array<ProductType>>([]);
    const [qty, setQty] = useState<number>(1);
    const [loadProduct] = useLazyQuery(GET_PRODUCT, {
        variables: { name: prodname, city: _user.address ? _user.address.key : '', categories: true, related: true },
        fetchPolicy: 'cache-and-network',
        onCompleted: (d) => {
            setProduct(d.product)
            if (d.product.categories) setCategories(d.product.categories);
            if (d.product.related) setRelated(d.product.related);
        }
    });
    const [addItem] = useMutation(ADD_ITEM, { variables: { product: { ...product, categories: [], description: false, qty } } });

    const addAndGo = () => {
        addItem();
        history.push('/checkout');
    }

    useEffect(() => {
        document.title = `${PRODUCT_TITLE} ${prodname}`;
        loadProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Suspense fallback={<Loader />}>
            <div className="main-container">
                <Header>
                    <HeaderLink onClick={() => history.push('/productos')}>
                        <span>{t('product.continue_shopping')}</span>
                        <ContinueArrow />
                    </HeaderLink>
                </Header>
                {product && product.entity_id && <Wrapper>
                    <Col1>
                        <Slider {...settings}>
                            {product.image.split(',').map((img: string, index: number) => <div key={index}><Image src={img}></Image></div>)}
                        </Slider>
                    </Col1>
                    <Col2>
                        <ProductTitle>{product.name}</ProductTitle>
                        <Price>Bs. {product.special_price.toFixed(2).replace('.', ',')}</Price>
                        <ProductText>
                            {product.description.split('\n').map((line: string, index: number) => <li key={index} dangerouslySetInnerHTML={{ __html: line }} />)}
                        </ProductText>
                        <Categories>
                            <span>{t('product.categories')}: </span>
                            {categories.map((cat: CategoryType, index: number) => <Link key={index} to={`/productos/${toLink(cat.name)}`}>{cat.name}</Link>)}
                        </Categories>
                        <Toolbox>
                            <Qty>
                                <select onChange={event => setQty(Number(event.target.value))}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((opt: any, index: number) => <option key={index} value={opt}>{opt}</option>)}
                                </select>
                                <Chevron />
                            </Qty>
                            <Cta filled={true} text={t('product.add')} action={addAndGo} />
                        </Toolbox>
                        <DeliveryBox>
                            <FreeDelivery />
                            <Title>
                                <span>{t('product.delivery.title')}</span>
                                <Text>{t('product.delivery.text')}</Text>
                            </Title>
                        </DeliveryBox>
                        <DeliveryBox>
                            <Quality />
                            <Title>
                                <span>{t('product.warranty.title')}</span>
                                <Text>{t('product.warranty.text')}</Text>
                            </Title>
                        </DeliveryBox>
                        <Disclaimer>{t('product.disclaimer')}</Disclaimer>
                    </Col2>
                </Wrapper>}
                {!!related.length && <RelatedProducts products={related} />}
            </div>
        </Suspense>
    );
}

export default Product;
