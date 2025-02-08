import Repository from './Repository';
import { GetUser } from './schema/User.schema';
import { API, graphqlOperation } from '@aws-amplify/api';
import { v4 as uuid } from 'uuid';

class CustomerRepository extends Repository {
  async fetchAllCustomers() {
    const message = this.buildMessage({});
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/customers',
        message,
      });
      return result.data.customerList;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }
}

export default new CustomerRepository();
