import { Model, snakeCaseMappers } from 'objection';

class ExampleGoodsModel extends Model {
  static get tableName() {
    return 'exampleGoods';
  }

  static get columnNameMappers() {
    return snakeCaseMappers({ upperCase: true });
  }
}

export default ExampleGoodsModel;
