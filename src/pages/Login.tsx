import LoginLeft from "@components/LoginLeft";
import LoginRight from "@components/LoginRight";

const Login: React.FC = () => {

  return (
    <div className="flex">
      <LoginLeft />
      <LoginRight />
    </div>
  );
};

export default Login;
