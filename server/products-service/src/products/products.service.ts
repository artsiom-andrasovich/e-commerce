import { TCreateProduct, TUpdateProduct } from './dto';

class ProductsService {
  //TODO: check role for create, update and delete
  public async getProduct(_id: string) {}

  public async getProducts(limit: number, cursor: string | undefined) {}

  public async createProduct(dto: TCreateProduct) {}

  public async updateProduct(dto: TUpdateProduct) {}

  public async deleteProduct(id: string) {}
}
