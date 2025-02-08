import Repository from './Repository';
import { API, graphqlOperation } from '@aws-amplify/api';
import {updateCompanyWithdrawal, updateWithdrawal} from "./schema/Withdrawal.schema";

class PaymentRepository extends Repository {
  async fetchWithdrawalRequests(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/withdrawal-requests',
        message,
      });

      return result.data.withdrawalsResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async fetchCompanyWithdrawal(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/company-withdrawals',
        message,
      });

      return result.data.withdrawalsResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async updateCompanySummary(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.SHOP_LAMBDA_API,
        path: '/withdrawal-company-summary/update',
        message,
      });

      console.log("+++++++++++++++++++, result result", result)

      return result.data.updatedResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async updateWithdrawalRequest(param) {
    try {
      console.log("+++++++++++++, param", param)
      const data = await API.graphql(graphqlOperation(updateWithdrawal, {input: param} ));
      console.log("+++++++++++++, data data", data)
      return data.data.updateWithdrawRequest;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async updateCompanyWithdrawal(param) {
    try {
      console.log("+++++++++++++, param", param)
      const data = await API.graphql(graphqlOperation(updateCompanyWithdrawal, {input: param} ));
      console.log("+++++++++++++, data data", data)
      return data.data.updateCompanyWithdrawal;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }
}

export default new PaymentRepository();
