interface Category {
    entity_id: number,
    name: string,
    quantity: number,
    category_image?: string, 
    __typename?: string,
}

interface Campaign {
    is_campaign: boolean,
    banner_mobile: string,
    banner_desktop: string,
    campaign_date_from: string,
    campaign_date_to: string
}

export interface SubCategoryLvl4Type extends Category, Campaign {}

export interface SubCategoryLvl3Type extends Category, Campaign {
    subcategories?: Array<SubCategoryLvl4Type>,
}

export interface CategoryType extends Category, Campaign {
    level: number,
    parent_id: number,
    subcategories?: Array<SubCategoryLvl3Type>,
}