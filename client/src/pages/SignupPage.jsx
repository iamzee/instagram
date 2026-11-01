import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const username = event.target.elements.username.value;
    const name = event.target.elements.name.value;

    const data = {
      email,
      password,
      username,
      name,
    };

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div>
      <div className="w-130 mx-auto pt-20">
        <h1 className="text-xl font-medium">
          Get started on Instagram with a Meta account
        </h1>
        <h2 className="text-sm text-muted-foreground">
          A Meta Account lets you access multiple Meta technologies, such as
          Instagram, easily and securely.
        </h2>
        <form className="space-y-5 pt-5" onSubmit={handleSubmit}>
          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              name="email"
              required
              type="email"
              placeholder="Email address"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              required
              type="password"
              placeholder="Password"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input name="name" id="name" required placeholder="Name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              required
              placeholder="Username"
            />
          </Field>
          <div className="space-y-2">
            <Button type="submit" className="w-full">
              Submit
            </Button>
            <Button type="button" variant="secondary" className="w-full">
              I already have an account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
