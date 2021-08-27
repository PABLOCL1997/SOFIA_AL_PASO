import React, { Suspense, FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CategoryType, SubCategoryLvl3Type } from "../../graphql/categories/type";
import useCategory from "../../hooks/useCategory";
import { titleCase, toLink } from "../../utils/string";

const Slider = React.lazy(() =>
  import(/* webpackChunkName: "Slider" */ "react-slick")
);

const List = styled.div`
  position: relative;
  z-index: 3;

  width: 100%;

  display:flex;

  justify-content: center;
  column-gap: 40px;

  padding: 20px 40px 0;
  
  background: var(--red);
  
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.4);


  a {
    position: relative;
    text-align: center;
    font-size: 12px;    
    color: var(--white);
    
    span {
      background: var(--red);
      
      display: inline-block;
      font-family: MullerMedium;
      line-height: 16px;
      min-height: 54px;
      
      span {
        min-height: 32px;
        border-bottom: 1px solid var(--red);
      }
    }
    a, div {
      display: none;
    }

  }

  & > a:hover, & > span:hover {
    font-family: MullerBold;
    
    span {
      font-family: MullerMedium;
      // padding-bottom: 2px;
      span {
        display: block;
        border-bottom: 1px solid #FFFFFF;
      }
    }

    a, div {
      display: flex;

    }
  }
  `;
const SubcategoriesWrapper = styled.div`
  background: var(--red);
  border-radius: 0px 0px 8px 8px;
  margin: 0 0 0 -24px;
  position: absolute;
  z-index: -1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 14px;
  
  & > a {
    font-family: MullerRegular;
    padding: 0 24px;  
    background: var(--red);
    text-align: left;
  }

  & > a:first-child {
    padding-top: 24px;
    box-shadow: inset 0px 2px 3px rgb(0 0 0 / 30%);  

  }
  & > a:last-child {
    padding-bottom: 24px;
  }
  &:hover, &>a:hover   {
    display:flex;
  }
  
  &>a:hover   {
    text-decoration: underline;
  }
`;

const SubcategoriesMobileWrapper = styled.article<{ visible: boolean, extended: boolean; }>`
${({ visible, extended }) =>  visible ? `
  border-radius: 0px 0px 8px 8px;
  position: relative;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 14px;

  padding: 0; 
  max-width: 170px;
  margin: 20px 0 0 -2px;
  background: var(--red);


  a {
    font-family: MullerBold;
    font-size: 10px;
    color: #FFFFFF;
    padding: 0 24px;  
  }

  a:first-child {
    padding-top: 24px;
    box-shadow: inset 0px 2px 3px rgb(0 0 0 / 30%);  
  }
  a:last-child {
    padding-bottom: 24px;
  }
  ${extended? 
    `
    margin: 8px 0 0 -2px;
    `:``
  }
`
:
`
  display: none;
`}
`;

const MobileWrapper = styled.div`
  position: absolute;
  top: 0; left: 0;
  // padding: 15px 0 5px 0;
  background: var(--red);
  height: 48px;
  width: 100%;
  overflow: visible;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.4);

  .list li {
    background-color: white;
    color: black;
    border-bottom: 2px solid black;
  }
  & > .slick-list {
    overflow: visible;
  }

  .slick-arrow.slick-prev {
    left: 0px;
    top: 22px;
    z-index: 2;
    
  }
  .slick-arrow.slick-next {
    right: 0px;
    top: 22px;
    z-index: 2;
  }

  `
  
const Category = styled.div<{ active: boolean}>`
  color: var(--white);
  text-align: center;
  font-family: MullerBold;
  font-size: 12px;
  padding: 16px 0 0 0;
  text-transform: uppercase;

  ${({ active }) =>  active ? `
  text-decoration: underline;
  ` : ``}

`

const ListMobile = styled.li`
  background: none;
  position: relative;
`

const Block = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  z-index: 1;
`

interface Props {
  isMobile: boolean;
}

const Categories: FC<Props> = ({ isMobile }) => {
    const { categories } = useCategory()
    const [selectedCategory, setSelectedCategory] = useState<number>(0)
    const EmbutidosId = 317
    const Premium = 356
    const Mascotas = 354
    const handleSelectCategory = (entity_id: number) => {
      if (selectedCategory === entity_id) return setSelectedCategory(0)
      setSelectedCategory(entity_id)
    }

    const settings = {
      dots: false,
      infinite: false,
      arrows: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1   
    }


    return (
      <>
      {isMobile ?
      <Block> {" "}
      <MobileWrapper>
      <Slider {...settings}>
      {categories && !!(categories.length) && React.Children.toArray(
        categories
        .filter((category: CategoryType)=> !category.is_campaign) 
        .map(({ name, entity_id, subcategories }: CategoryType) =>
          <ListMobile>
            <Category
              active={selectedCategory === entity_id}
              onClick={() => handleSelectCategory(entity_id)}>
               {name}
            </Category>
            {!!(subcategories?.length) && 
              <SubcategoriesMobileWrapper visible={selectedCategory === entity_id} extended={ entity_id === EmbutidosId ||  entity_id === Premium || entity_id === Mascotas}>
                {React.Children.toArray(subcategories.map(({ name: nameSub }: SubCategoryLvl3Type) => 
                  <Link to={`/productos/${toLink(name)}/${toLink(nameSub)}`}>{nameSub.toUpperCase()}</Link>
                ))}              
              </SubcategoriesMobileWrapper>
            }
          </ListMobile>))}
      </Slider>
      </MobileWrapper></Block>
      : 
      <>
      {categories && 
        <List>
            {categories && !!(categories.length) && React.Children.toArray(
                categories
                .filter((category: CategoryType)=> !category.is_campaign) 
                .map(({ name, subcategories }: CategoryType) => (
                  <Link to={`/productos/${toLink(name)}`}>
                      <span>
                        <span>
                          {name.toUpperCase()}
                        </span>
                      </span>
                        {!!(subcategories?.length) && 
                          <SubcategoriesWrapper>
                            {React.Children.toArray(subcategories.map(({ name: nameSub }: SubCategoryLvl3Type) => 
                              <Link to={`/productos/${toLink(name)}/${toLink(nameSub)}`}>{nameSub.toUpperCase()}</Link>
                            ))}
                          </SubcategoriesWrapper>
                        }
                  </Link>
                ))
            )}
        </List>
        }
      </>}
      </>
    )

};


export default Categories;