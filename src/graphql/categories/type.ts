export type SubCategoryLvl4Type = {
    entity_id: number,
    name: string,
    quantity: number,
    category_image?: string, 
    __typename?: string,
    
}

export type SubCategoryLvl3Type = {
    entity_id: number,
    name: string,
    quantity: number,
    category_image?: string,
    subcategories?: Array<SubCategoryLvl4Type>,
    __typename?: string,
 
}

export type CategoryType = {
    entity_id: number,
    name: string,
    level: number,
    parent_id: number,
    quantity: number,
    category_image?: string,
    subcategories?: Array<SubCategoryLvl3Type>,
    __typename?: string,
    
}