import { SignInButton } from "@clerk/nextjs";

// ** TODO: TEMPORARY
// In 1.0 there is no authentication nor users except for the admin role
export default function SignIn() {
  return (
    <div>
      <SignInButton />
    </div>
  );
}
