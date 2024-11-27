import { Client, useTokenManagement } from "@/api/axios";
import { tokenState, userState } from "@/atoms/Atom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
// import useAuth from "@/hooks/useAuth";

// Enhanced form schema with more robust validations
const formSchema = z.object({
  loginType: z.enum(["username", "email"], {
    required_error: "Please select a login type.",
  }),
  identifier: z.string().min(3, { message: "Must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
const SignIn: React.FC = () => {
  // const isAuthenticated = useAuth();
  const [loginType, setLoginType] = useState<"username" | "email">("username");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginType: "username",
      identifier: "",
      password: "",
    },
    mode: "all", // Changed to 'all' for comprehensive validation
    reValidateMode: "onChange",
  });

  const { setToken } = useTokenManagement(tokenState);
  const setUserState = useSetRecoilState(userState);
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(-1);
  //   }
  // }, [isAuthenticated]);

  // Enhanced form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Reset global error
    setGlobalError(null);

    try {
      // Manually trigger validation
      const isValid = await form.trigger();
      if (!isValid) {
        // Show form-level errors if validation fails
        return;
      }

      const loginPayload =
        values.loginType === "username"
          ? { username: values.identifier, password: values.password }
          : { email: values.identifier, password: values.password };

      // Ensure await is used with the axios call
      const res = await Client.post("/auth", loginPayload);

      if (res.status === 200 && res.data) {
        setToken(res.data.accessToken);
        setUserState(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast({
          variant: "default",
          title: "Login Successful",
          description: "You have successfully logged in.",
        });
        console.log(res.data);
        if (res.data.user.role.name === "admin") {
          navigate("/admin");
        } else if (res.data.user.role.name === "user") {
          navigate("/users");
        } else if (res.data.user.role.name === "manager") {
          navigate("/manager");
        }
      }
    } catch (error: any) {
      // Comprehensive error handling
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response) {
        // Server responded with an error
        errorMessage =
          error.response.data.message ||
          "Login failed. Please check your credentials.";

        // Set global error state
        setGlobalError(errorMessage);
      } else if (error.request) {
        // Request made but no response received
        errorMessage =
          "No response from the server. Please check your network connection.";
        setGlobalError(errorMessage);
      }

      // Toast notification
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });

      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full z-10 max-w-xl    shadow-xl hover:shadow-md transition-shadow duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>
            <h2 className="text-4xl font-space-mono">Sign In</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Global Error Display */}
          {globalError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{globalError}</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Login Type Radio Group (unchanged) */}
              <FormField
                control={form.control}
                name="loginType"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup
                      defaultValue="username"
                      onValueChange={(value: "username" | "email") => {
                        setLoginType(value);
                        field.onChange(value);
                      }}
                      className="flex items-center space-x-4 mb-4 justify-start"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="username" id="username" />
                        <Label htmlFor="username">Username</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email">Email</Label>
                      </div>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Identifier Field (unchanged) */}
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {loginType === "username" ? "Username" : "Email"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          loginType === "username"
                            ? "Enter username"
                            : "Enter email address"
                        }
                        type={loginType === "username" ? "text" : "email"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field (unchanged) */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Individual Field Errors */}
              {form.formState.errors &&
                Object.keys(form.formState.errors).length > 0 && (
                  <div
                    className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <strong className="font-bold">Validation Errors: </strong>
                    <ul className="list-disc list-inside mt-2">
                      {Object.values(form.formState.errors).map(
                        (error, index) => (
                          <li key={index} className="text-sm">
                            {error.message}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={!form.formState.isValid}
              >
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
