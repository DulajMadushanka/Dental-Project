import Repository from "./Repository";
import { v4 as uuid } from "uuid";
import { Auth } from "@aws-amplify/auth";

let _user: any = null;

class AuthRepository extends Repository {
  async login(username, password) {
    try {
      const user = await Auth.signIn(username, password);
      return user;
    } catch (error) {
      return { error };
    }
  }

  async authenticatedUser() {
    try {
      const user = await Auth.currentAuthenticatedUser({
        bypassCache: false,
      });
      return user;
    } catch (error) {
      console.warn("error : ", error);
      return { error };
    }
  }

  async signUp(params, pw) {
    try {
      const newParam = {
        username: params.email,
        password: params.password,
        attributes: {
          email: params.email,
          "custom:id": uuid(),
          family_name: params.lastName,
          given_name: params.firstName,
          phone_number: `+${params.phoneNumber}`,
          name: `${params.firstName} ${params.lastName}`
        },
      }

      const signUp = await Auth.signUp(newParam);
      return signUp;
    } catch (error) {
      console.warn("catched error", error);
      return { error };
    }
  }

  async confirmSignIn(params) {
    try {
      //await this.authenticateUser('USER');
      const user = await Auth.sendCustomChallengeAnswer(
        params.user,
        params.code
      );
      return user;
    } catch (error) {
      console.log("[User] challenge error", error);
      return { error };
    }
  }

  async confirmSignUp(params) {
    try {
      const confirmUser = await Auth.confirmSignUp(params.email, params.code);
      return confirmUser;
    } catch (error) {
      console.warn("catched error", error);
      return { error };
    }
  }

  async logout() {
    try {
      const logoutResult = await Auth.signOut({ global: true });
      window.localStorage.removeItem(
        "CognitoIdentityId-ap-southeast-1:2fb4e791-d71d-4a6f-b424-3b3d0fbf3f1a"
      );
      return logoutResult;
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  }

  async loginWithPassword(username, pw) {
    //await this.authenticateUser('USER');
    const result = await Auth.signIn(username, pw);
    return result;
  }

  async forgotPassword(username) {
    const message = this.buildMessage({ username });
    try {
      const result = await this.apiPost({
        apiName: this.API_ADMIN_DASHBOARD,
        path: "/user/username",
        message,
      });
      if (
        result.data &&
        result.data.userResult &&
        result.data.userResult.UserStatus === "CONFIRMED"
      ) {
        const result = await Auth.forgotPassword(username);
        return result;
      } else {
        return result.data.userResult;
      }
    } catch (error) {
      console.warn("error", error);
      return { error };
    }
  }

  async forgotPasswordSubmit(username, code, new_password) {
    const result = await Auth.forgotPasswordSubmit(
      username,
      code,
      new_password
    );
    return result;
  }
}
export default new AuthRepository();
