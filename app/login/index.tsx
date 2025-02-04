import { Form } from "@/components";
import { formattedPathname } from "@/utils";
import { usePathname } from "expo-router";

const LoginScreen = () => {
  const pathname = usePathname();

  return <Form pathname={formattedPathname(pathname)} title="Log in" />;
};

export default LoginScreen;
