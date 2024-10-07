import { SignUp } from "@clerk/clerk-react";
import "./signUpPage.css";

export default function SignUpPage() {
  return (
    <div className="signUpPage">
      <SignUp path="/sign-up" signInUrl="sign-in" />
    </div>
  );
}
