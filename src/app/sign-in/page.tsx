import {
  AnonymousSignInButton,
  GitHubSignInButton,
} from "~/components/sign-in-button";
import { H1 } from "~/components/ui/h1";
import { Separator } from "~/components/ui/separator";

export default function SignInPage() {
  return (
    <main className="flex flex-col items-center gap-8">
      <H1 className="pt-4">Sign In</H1>
      <div className="flex flex-col items-center gap-4">
        <GitHubSignInButton />
        <div className="flex items-center justify-center gap-4">
          <Separator />
          <span className="text-muted-foreground">OR</span>
          <Separator />
        </div>
        <AnonymousSignInButton />
      </div>
    </main>
  );
}
