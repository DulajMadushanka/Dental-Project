import { NetworkError } from "../models";
import { API } from "@aws-amplify/api";
import { Auth } from "@aws-amplify/auth";
import { Storage } from "@aws-amplify/storage";

let _navigator;
Storage.configure({ level: "public" });

const Config = {
  API_NAME: "dev-patient-lambda-api",
  SHOP_LAMBDA_API: 'dev-shop-lambda-api',
  BASKET_BUDDY_LAMBDA_API: 'dev-basket-buddy-lambda-api',
};

export default class Repository {
  constructor() {
    this.API = API;
    this.Storage = Storage;
    this.API_NAME = Config.API_NAME;
    this.SHOP_LAMBDA_API = Config.SHOP_LAMBDA_API;
    this.BASKET_BUDDY_LAMBDA_API = Config.BASKET_BUDDY_LAMBDA_API
  }

  buildMessage(body) {
    return {
      headers: {},
      body,
      response: true,
    };
  }

  async api(method = "get", apiName, path, message) {
    return this.API[method](apiName, path, { ...message }).catch(
      (error) => {
        console.warn("error is : ", error);
        // throw error;
        const code = error.code || NetworkError.NETWORK_ERROR_CODE;
        const errorMessage =
          error.message || NetworkError.NETWORK_ERROR_MESSAGE;
        //throw new NetworkError(code, { errorMessage, apiName, path, message, method }, error);
        return null;
        // return Promise.reject(new NetworkError('code', 'message', error));
      }
    );
  }

  apiPost({ apiName = this.API_NAME, path, message }) {
    return this.api("post", apiName, path, message);
  }

  apiPut({ apiName = this.API_NAME, path, message }) {
    return this.api("put", apiName, path, message);
  }

  apiDelete({ apiName = this.API_NAME, path, message }) {
    return this.api("del", apiName, path, message);
  }

  apiGet({ apiName = this.API_NAME, path, message = null }) {
    return this.api("get", apiName, path, message);
  }

  uploadImage = async (file, fileName) => {
    try {
      const result = await Storage.put(fileName, file, {
        contentType: file.type,
      });
      return result;
    } catch (error) {
      return { error };
    }
  };
}

const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
};

// add other navigation functions that you need and export them

export { setTopLevelNavigator };
