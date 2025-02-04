import { usePathname } from "expo-router";
import { Form } from "@/components";
import { formattedPathname } from "@/utils";

const SignupScreen = () => {
  const pathname = usePathname();

  return <Form pathname={formattedPathname(pathname)} title="Sign up" />;
};

export default SignupScreen;
