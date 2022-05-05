import gql from "graphql-tag";

export const GET_METADATA = gql`
  query Metadata($identifier: String!) {
    metadata(identifier: $identifier) {
      page_id
      title
      meta_keywords
      meta_description
      identifier
    }
  }
`;

export const GET_BRANDS = gql`
  query Get_Brands($categoryId: Int!, $city: String!, $id_price_list: Int, $store: String, $agency: String) {
    brands(category_id: $categoryId, city: $city, id_price_list: $id_price_list, store: $store, agency: $agency) {
      name
      quantity
    }
  }
`;

export const GET_BANNERS = gql`
  query Banners($mobile: Boolean!) {
    banners(mobile: $mobile) {
      banner7_id
      title
      link
      image
      order
      description
      status
    }
  }
`;

export const GET_PAGES = gql`
  query GetPages($identifier: String!) {
    pages(identifier: $identifier) {
      page_id
      title
      meta_keywords
      content
      meta_description
      identifier
    }
  }
`;

export const GET_TIME_FRAMES = gql`
  query getStoreTimeFrames($city: String!) {
    timeFrames(city: $city) {
      turno {
        inicio
        fin
      }
      horario_corte {
        horario
        mismo_dia
        dia_anterior
      }
    }
  }
`;
