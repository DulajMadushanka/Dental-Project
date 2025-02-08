import * as Yup from "yup";
import { Formik } from "formik";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import Logo from "../../../assets/images/logo.jpg";
import LoginImage from "../../../assets/images/login-image.jpg";
import { Actions } from "../../../internals/app/Actions";
import FormInput from "../../../components/inputs/FormInput";
import { CircularProgress } from "@material-ui/core";
import AuthRepository from "../../../internals/repository/AuthRepository";

const SignInView = (props: any) => {
  const { login, loadingAction } = props;
  const { action, loading } = loadingAction;

  const onClickSubmit = async (values: any) => {
    // await AuthRepository.signUp({
    //   firstName: "Madura",
    //   lastName: "Waliwita",
    //   password: "madurawaliwita",
    //   email: "madurawaliwita@gmail.com",
    //   phoneNumber: "94715145384"
    // })
    login(values.email, values.password);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Must be 8 characters or more")
      .required("Password is required"),
  });

  return (
    <section className=" bg-gray-50 flex flex-row">
      <div className="max-w-5xl w-full h-full flex flex-col items-center justify-center p-6 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center justify-center mb-6 text-4xl font-semibold text-gray-900 ">
          <img src={Logo} alt="logo" className="w-[190px] h-[110px] mr-6" />
          Madura Dental Clinic
        </div>
        <div className="flex flex-row w-full bg-white rounded-lg shadow md:mt-0  xl:p-0">
          <div className="flex-col w-1/2 hidden md:block items-center justify-center h-full">
            <img
              alt=""
              className="h-full rounded-l-lg"
              src={LoginImage}
            />
          </div>
          <div className="p-6 md:w-1/2 w-full space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Login
            </h1>

            <Formik
              onSubmit={(values) => onClickSubmit(values)}
              enableReinitialize={true}
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
            >
              {({ values, errors, touched, handleSubmit, handleChange }) => {
                return (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 md:space-y-6"
                  >
                    <FormInput
                      id="email"
                      label="Your email"
                      value={values.email}
                      error={errors.email}
                      touched={touched.email}
                      placeholder="name@company.com"
                      onChange={handleChange("email")}
                    />
                    <FormInput
                      id="password"
                      type="password"
                      label="Password"
                      value={values.password}
                      error={errors.password}
                      placeholder="**********"
                      touched={touched.password}
                      onChange={handleChange("password")}
                    />
                    <div className="flex flex-row justify-end items-start">
                      <NavLink
                        to="/forget-password"
                        className="text-sm text-medium-slate-blue hover:underline "
                      >
                        Forget password
                      </NavLink>
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-medium-slate-blue hover:bg-primary-700 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
                    >
                      {loading && action.type === "LOGIN" ? (
                        <CircularProgress
                          size={15}
                          style={{ color: "#EFF0F8" }}
                        />
                      ) : (
                        <>Login</>
                      )}
                    </button>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};
export default connect(
  (state: any) => ({
    loadingAction: state.common.get("loadingAction"),
  }),
  {
    login: Actions.login.login,
  }
)(SignInView);
