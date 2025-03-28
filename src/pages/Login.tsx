import LoginLeft from "@components/Login/LoginLeft";
import LoginRight from "@components/Login/LoginRight";

const Login: React.FC = () => {

  return (
    <div className="flex">
      <LoginLeft />
      <LoginRight />
    </div>
  );
};

export default Login;
