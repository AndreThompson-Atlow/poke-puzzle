import { Injectable } from '@angular/core';
import { ILevel, IType, TypeEfficacy, TypeName } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class TypesService {
  private _baseTypes: IType[]
  private _currentLevel: number;
  private _levelTypeDictionary: ILevel;

  constructor() { 
    this._currentLevel = 1;
    this._levelTypeDictionary = {}
    this._baseTypes = this._initBaseTypes();
  }

  private _initBaseTypes(): IType[] {
    const lTypes: IType[] = [];
    // Init each type and return
    // Normal
    const lNormalType = this._genType(
      TypeName.Normal,
      [],
      [TypeName.Fighting],
      [TypeName.Ghost]
    );
    lTypes.push(lNormalType);
    
    // Fire
    const lFireType = this._genType(
      TypeName.Fire,
      [TypeName.Fire, TypeName.Grass, TypeName.Ice, TypeName.Bug, TypeName.Steel, TypeName.Fairy],
      [TypeName.Water, TypeName.Ground, TypeName.Rock],
      []
    );
    lTypes.push(lFireType);

    // Water
    const lWaterType = this._genType(
      TypeName.Water,
      [TypeName.Fire, TypeName.Water, TypeName.Ice, TypeName.Steel],
      [TypeName.Grass, TypeName.Electric],
      []
    );
    lTypes.push(lWaterType);

    // Grass
    const lGrassType = this._genType(
      TypeName.Grass,
      [TypeName.Water, TypeName.Grass, TypeName.Electric, TypeName.Ground],
      [TypeName.Fire, TypeName.Ice, TypeName.Poison, TypeName.Flying, TypeName.Bug],
      []
    );
    lTypes.push(lGrassType);

    return lTypes;
  }  

  /**
   * Generates a type based on the current level. 
   * @param typeName 
   * @param resists 
   * @param weak 
   * @param nulls 
   * @returns a completed IType.
   */
  private _genType(typeName: TypeName, resists: TypeName[], weak: TypeName[], nulls: TypeName[]): IType {
    return {
      typeName,
      resists: this._filterByLevel(resists, this._currentLevel),
      weak: this._filterByLevel(weak, this._currentLevel),
      nulls: this._filterByLevel(nulls, this._currentLevel)
    }
  }

  /**
   * Takes a list of types and a difficulty level and simplifies the types by the current level.
   * @param inTypes 
   */
  private _filterByLevel(inTypes: TypeName[], inLevel: number): TypeName[]{
    const lTypesToUse = this._getTypesByLevel(inLevel);
    return inTypes.filter(inType => lTypesToUse.includes(inType));
  }

  /**
   * Return all Types that are used at a specific difficulty level. 
   * @param inLevel 
   * @returns 
   */
  private _getTypesByLevel(inLevel: number): TypeName[]{
    if(!this._levelTypeDictionary[inLevel]){
      //If no types are set for the current level, then set them before returning.
      const lAllTypes: TypeName[] = [];
      lAllTypes.push(TypeName.Normal, TypeName.Fire, TypeName.Water, TypeName.Grass, TypeName.Electric, TypeName.Ice, TypeName.Fighting, TypeName.Poison, TypeName.Ground, TypeName.Flying, TypeName.Psychic, TypeName.Bug, TypeName.Rock, TypeName.Ghost, TypeName.Dragon, TypeName.Dark, TypeName.Steel, TypeName.Fairy);
      const lTypesToUse = lAllTypes.splice(2 + inLevel);
      this._levelTypeDictionary[inLevel] = lTypesToUse;
    }
    return this._levelTypeDictionary[inLevel];
  }

  public getTypes(): IType[]{
    const lTypesByLevel = this._getTypesByLevel(this._currentLevel);
    return this._baseTypes.filter(lType => {
      return lTypesByLevel.includes(lType.typeName);
    })
  }

  public getAttackEfficacy(inAttackType: IType, inDefenseTypes: IType | IType[]): number {
    const lDefenseTypes = Array.isArray(inDefenseTypes) ? inDefenseTypes : [inDefenseTypes];
    if(lDefenseTypes.length > 1){
      const lFirstTypeEfficacy = this.getAttackEfficacy(inAttackType, lDefenseTypes[0]);
      const lSecondtypeEfficacy = this.getAttackEfficacy(inAttackType, lDefenseTypes[1]);
      const lFinalEfficacyValue = lFirstTypeEfficacy * lSecondtypeEfficacy;
      let lSimplifiedEfficacyValue = 0;
      if(lFinalEfficacyValue === 0.25 || lFinalEfficacyValue === 0.5){
        lSimplifiedEfficacyValue = 0.5;
      } else if(lFinalEfficacyValue === 1){
        lSimplifiedEfficacyValue = 1;
      } else if(lFinalEfficacyValue === 2 || lFinalEfficacyValue === 4){
        lSimplifiedEfficacyValue = 2;
      }
      return lSimplifiedEfficacyValue;
    } else {
      const lDefenseType = lDefenseTypes[0];
      const lIsSuperEffective = lDefenseType.weak.includes(inAttackType.typeName);
      const lIsSlightlyEffective = lDefenseType.resists.includes(inAttackType.typeName);
      const lIsNotEffective = lDefenseType.nulls.includes(inAttackType.typeName);
      const lIsEffective = !lIsSuperEffective && !lIsSlightlyEffective && !lIsNotEffective;
      if(lIsSuperEffective){
        return TypeEfficacy.SuperEffective;
      } else if(lIsEffective){
        return TypeEfficacy.Effective;
      } else if(lIsSlightlyEffective){
        return TypeEfficacy.SlightlyEffective;
      } else {
        return TypeEfficacy.NotEffective;
      }
    }
  }
}
