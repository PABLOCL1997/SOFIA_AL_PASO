import { useMutation } from "react-apollo";
import { RECOVER, SIGN_UP } from "../graphql/user/mutations";

const useAuth = () => {
  const [signUp] = useMutation(SIGN_UP);
  const [recoverPassword] = useMutation(RECOVER);  

  return {
    signUp,
    recoverPassword
  }
};

export default useAuth;