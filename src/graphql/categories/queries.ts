import gql from "graphql-tag";

export const GET_CATEGORIES = gql`
  query Categories($city: String!) {
    categories(city: $city) {
      entity_id
      name
      quantity
      category_image
      is_campaign
      banner_mobile
      banner_desktop
      campaign_date_from
      campaign_date_to
      subcategories {
        entity_id
        quantity
        name
        category_image
        is_campaign
        banner_mobile
        banner_desktop
        campaign_date_from
        campaign_date_to
        subcategories {
          entity_id
          quantity
          name
          category_image
          is_campaign
          banner_mobile
          banner_desktop
          campaign_date_from
          campaign_date_to
        }
      }
    }
  }
`;
