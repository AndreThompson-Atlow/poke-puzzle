export enum TypeName {
    Normal,
    Fire,
    Water,
    Grass,
    Electric,
    Ice,
    Fighting,
    Poison,
    Ground,
    Flying,
    Psychic,
    Bug,
    Rock,
    Ghost,
    Dragon,
    Dark,
    Steel,
    Fairy
};

export enum TypeEfficacy {
    SuperEffective = 2,
    Effective = 1,
    SlightlyEffective = 0.5,
    NotEffective = 0
}
export interface IType {
    typeName: TypeName,
    resists: TypeName[],
    nulls: TypeName[],
    weak: TypeName[]
}

export interface IDualType {
    firstType: IType,
    secondType: IType,
    resists: TypeName[],
    nulls: TypeName[],
    weak: TypeName[]
}

export interface ILevel {
    [key: number]: TypeName[]
}
