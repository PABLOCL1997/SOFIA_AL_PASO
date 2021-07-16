import gql from 'graphql-tag'

export const GET_METADATA = gql`
query Metadata($identifier: String!) {
    metadata(identifier: $identifier){
      page_id,
      title,
      meta_keywords,
      meta_description,
      identifier
    } 
} 
`

export const GET_BRANDS = gql`
query Get_Brands($categoryId: Int!, $city: String!)
{
  brands(category_id:$categoryId, city:$city){
    name,
    quantity
  }
}
`

export const GET_BANNERS = gql`
query Banners($mobile: Boolean!){
  banners(mobile: $mobile){
    banner7_id
    title
    link
    image
    order
    description
    status
  }
}
`