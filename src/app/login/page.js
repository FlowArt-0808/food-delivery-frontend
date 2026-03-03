"use client";

import Image from "next/image";
import Link from "next/link";
import UserFormImage from "../_components/images/UserFormImage.png";
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
import axios from "axios";
import { API_BASE } from "@/lib/api-base";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
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
        const response = await axios.post(`${API_BASE}/authentication/login`, {
          email: values.email,
          password: values.password,
        });

        const data = response.data;

        if (data?.token) {
          localStorage.setItem("authToken", data.token);
        }

        window.location.href = "/home";
      } catch (err) {
        const message = err?.response?.data?.message || err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  return (
    <div className="flex items-center justify-center gap-12">
      <div className="w-104 pl-25">
        <FieldSet>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel className="text-[24px] font-semibold text-[#09090B]">Welcome back</FieldLabel>

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

            {errors.email && touched.email && <div className="text-sm text-red-500">{errors.email}</div>}

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.password && touched.password && <div className="text-sm text-red-500">{errors.password}</div>}

            {error && <div className="text-sm font-medium text-red-500">{error}</div>}

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-[14px] text-[#2563EB] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              <div>{loading ? "Logging in..." : "Log in"}</div>
            </Button>

            <div aria-label="Section to register" className="flex items-center justify-center gap-3 text-[16px]">
              Dont have an account? <Link href="/signup" className="text-[#2563EB]">Sign up</Link>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>

      <Image
        src={UserFormImage}
        alt="Food delivery form visual"
        className="h-[904px] w-[856px] rounded-md object-cover pr-5"
        priority
      />
    </div>
  );
};

export default Login;
