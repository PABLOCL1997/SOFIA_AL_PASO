import axios from "axios";
import { print } from "graphql";
import { RECOVER, SIGN_UP } from "../graphql/user/mutations";

interface Props {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export const signUp = async ({ email, firstname, lastname, password }: Props) => {
  const response = await axios.post(process.env.REACT_APP_GRAPHQL as string, {
    query: print(SIGN_UP),
    variables: {
      email,
      firstname,
      lastname,
      password,
      network: false
    },
  });

  return response.data;    
} 

export const recoverPassword = async(email: string) => {
  const response = await axios.post(process.env.REACT_APP_GRAPHQL as string, {
    query: print(RECOVER),
    variables: {
      email,
      url: process.env.REACT_APP_SITE_URL + "/password-reset",
      bompras: false
    }
  });

  return response.data;
}