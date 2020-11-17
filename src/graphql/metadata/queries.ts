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
