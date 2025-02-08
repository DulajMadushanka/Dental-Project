import Repository from './Repository';
import {GetUser, UpdateUser} from './schema/User.schema';
import { API, graphqlOperation } from '@aws-amplify/api';
import { v4 as uuid } from 'uuid';

class UserRepository extends Repository {
  async getUserForId(id) {
    try {
      const data = await API.graphql(graphqlOperation(GetUser, { id }));
      return data.data.getUser;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async updateUser(param) {
    try {
      console.log("+++++++++++++, param", param)
      const data = await API.graphql(graphqlOperation(UpdateUser, {input: param} ));
      return data.data.updateUser;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async deleteCognitoUser(phone) {
    const message = this.buildMessage({ userId: `${phone}` });
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/remove-user-cognito',
        message,
      });
      return result.data;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async createDashboardUser(params, password, phoneNumber) {
    const param = {
      userId: params.uid,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      password,
      phoneNumber,
    };
    const message = this.buildMessage(param);

    try {
      const result = await this.apiPost({
        apiName: this.API_ADMIN_DASHBOARD,
        path: '/confirm',
        message,
      });
      return result.data.userResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async getUserFromCognito(username) {
    const message = this.buildMessage({ username });

    try {
      const result = await this.apiPost({
        apiName: this.API_ADMIN_DASHBOARD,
        path: '/user/username',
        message,
      });
      return result.data.userResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async createCheckingGuest(params) {
    const message = this.buildMessage(params);

    try {
      const result = await this.apiPost({
        apiName: this.API_TVILU_PUBLIC_API,
        path: '/checking',
        message,
      });
      return result.data.checkingResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async getLatCheckingGuest(salonId) {
    const message = this.buildMessage({ salonId });

    try {
      const result = await this.apiPost({
        apiName: this.API_TVILU_PUBLIC_API,
        path: '/checking/salon-id',
        message,
      });

      return result.data.checkingResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async fetchSalonChecking(salonId, limit, lastKey) {
    const message = this.buildMessage({ salonId, limit, lastKey });

    try {
      const result = await this.apiPost({
        apiName: this.API_ADMIN_DASHBOARD,
        path: '/checkings/salon-id',
        message,
      });
      return result.data.checkingResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async searchCheckingGuest(salonId, searchText, limit, lastKey) {
    const message = this.buildMessage({ salonId, searchText, limit, lastKey });

    try {
      const result = await this.apiPost({
        apiName: this.API_ADMIN_DASHBOARD,
        path: '/salon/salon-id/search-text',
        message,
      });

      return result.data;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }

  async fetchPaginateSalonChecking(salonId, limit, lastKey) {
    const message = this.buildMessage({ salonId, limit, lastKey });

    try {
      const result = await this.apiPost({
        apiName: this.API_ADMIN_DASHBOARD,
        path: '/checkings/salon-id',
        message,
      });

      return result.data.checkingResult;
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

  // async updateCheckingGuest(param) {
  //   try {
  //     const data = await API.graphql(
  //       graphqlOperation(UpdateChecking, { input: param }),
  //     );
  //     return data.data.updateCheckingGuest;
  //   } catch (error) {
  //     console.warn('error', error);
  //     return { error };
  //   }
  // }

  // async subscribeToClientScreening(salonId) {
  //   try {
  //     const param = { salonId };
  //     clientScreeningSub && clientScreeningSub.unsubscribe();
  //     clientScreeningSub = await API.graphql(
  //       graphqlOperation(onCreateChecking, param),
  //     ).subscribe({
  //       next: clientScreening => {
  //         store.dispatch(
  //           Actions.receivedScreening(
  //             clientScreening.value.data.onCreateCheckingGuest,
  //           ),
  //         );
  //       },
  //       complete: () => {
  //         subDelay = _.delay(
  //           () => this.subscribeToClientScreening(salonId),
  //           2000,
  //         );
  //       },
  //       error: error => {
  //         subDelay = _.delay(
  //           () => this.subscribeToClientScreening(salonId),
  //           2000,
  //         );
  //         console.log(error);
  //       },
  //     });

  //     return clientScreeningSub;
  //   } catch (error) {
  //     console.warn('catched error', error);
  //   }
  // }

  // async deleteClientScreening(guestId) {
  //   try {
  //     // await AuthRepository.authenticateUser('ADMIN');
  //     const data = await API.graphql(
  //       graphqlOperation(DeleteChecking, { input: { guestId } }),
  //     );
  //     return data.data.deleteCheckingGuest;
  //   } catch (error) {
  //     console.warn('error', error);
  //     return { error };
  //   }
  // }
}

export default new UserRepository();
