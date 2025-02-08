import Repository from './Repository';
import {GetUser, UpdateUser} from './schema/User.schema';
import { API, graphqlOperation } from '@aws-amplify/api';
import { v4 as uuid } from 'uuid';
import {CreateProduct, DeleteProduct, UpdateProduct} from "./schema/Product.schema";

class ShopRepository extends Repository {
  async fetchAllShops() {
    const message = this.buildMessage({});
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/shops',
        message,
      });
      return result.data.shopList;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async fetchShopProducts(shopId) {
    const message = this.buildMessage({shopId});
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/shop/products',
        message,
      });
      return result.data.productList;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async fetchAllOrders(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/all-orders',
        message,
      });
      return result.data.orderResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async searchShops(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/shops/text',
        message,
      });
      return result.data.shopList;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async createShopProduct(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/shops/create-product',
        message,
      });
      return result.data.productResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async createShopFileProduct(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/shops/create-product-file',
        message,
      });
      return result.data.shopList;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async deleteUserProduct(param) {
    try {
      console.log("+++++++++++++, param", param)
      const data = await API.graphql(graphqlOperation(DeleteProduct, {input: param} ));
      return data.data.deleteShopProduct;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async updateUserProduct(param) {
    try {
      console.log("+++++++++++++, param", param)
      const data = await API.graphql(graphqlOperation(UpdateProduct, {input: param} ));
      return data.data.updateShopProduct;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async createUserProduct(param) {
    try {
      console.log("+++++++++++++, param", param)
      const data = await API.graphql(graphqlOperation(CreateProduct, {input: param} ));
      return data.data.createShopProduct;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async uploadToS3Image(file) {
    try {
      let fileId;
      if (file) {
        fileId = `${uuid()}.${file.name.split('.').pop()}`;
        console.log({ file, fileId });
        return await this.uploadImage(file, fileId);
      }
      return null;
    } catch (error) {
      return { error };
    }
  }
}

export default new ShopRepository();
