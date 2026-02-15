"use client";
// hello
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { axios } from "axios";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        // Send a POST request to the login endpoint with email and password
        const response = await axios.post(
          "http://localhost:999/authentication/login", // Backend login URL
          {
            email: values.email, // User's email from form
            password: values.password, // User's password from form
          },
        );

        // Check if the response is JSON format
        // If not, throw an error (server might have crashed or returned HTML error page)
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Server error: Invalid response format. Please check your backend endpoint.",
          );
        }

        // Log the response data to console for debugging
        console.log(data, "LOGIN RESPONSE DATA");

        // If server sent back a token (for authentication)
        // Save it to browser's localStorage so user stays logged in
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        // Show success message
        alert("Login successful! Welcome back!");

        // Redirect user to dashboard page
        window.location.href = "http://localhost:3000/home";
      } catch (err) {
        console.error("Login error:", err);
        setError(err.message);
        alert(`Login failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  return (
    <div className="flex gap-12 items-center justify-center">
      <div className="w-104 pl-25">
        <FieldSet>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel className="text-[24px] text-[#09090B] font-semibold">
                Welcome back
              </FieldLabel>

              <FieldDescription className="text-[16px] font-400 text-[#71717A]">
                Log in to access your account and explore your favorite dishes.
              </FieldDescription>
            </Field>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.email && touched.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.password && touched.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}

            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            <div className="flex items-center justify-end">
              <a
                href="http://localhost:3000/forgot-password"
                className="text-[14px] text-[#2563EB] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              <div>{loading ? "Logging in..." : "Log in"}</div>
            </Button>

            <div
              aria-label="Section to register"
              className="flex items-center justify-center text-[16px] gap-3"
            >
              Dont have an account?{" "}
              <a
                href="http://localhost:3000/register"
                className="text-[#2563EB]"
              >
                Sign up
              </a>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>

      <div
        aria-label="Image for user form"
        className=" bg-center bg-no-repeat w-[856px] h-[904px] rounded-md pr-5"
      ></div>
    </div>
  );
};

export default Login;
