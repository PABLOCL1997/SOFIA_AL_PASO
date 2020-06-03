export type SubCategoryLvl4Type = {
    entity_id: number,
    name: string
}

export type SubCategoryLvl3Type = {
    entity_id: number,
    name: string,
    subcategories?: Array<SubCategoryLvl4Type>
}

export type CategoryType = {
    entity_id: number,
    name: string,
    level: number,
    parent_id: number,
    subcategories?: Array<SubCategoryLvl3Type>
}