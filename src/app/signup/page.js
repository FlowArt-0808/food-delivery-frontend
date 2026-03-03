"use client";

import { useState } from "react";
import * as Yup from "yup";
import Step1 from "./_features/step1";
import Step2 from "./_features/step2";
import { useFormik } from "formik";
import axios from "axios";
import { API_BASE } from "@/lib/api-base";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain letters")
    .matches(/[0-9]/, "Password must contain numbers")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // After clicking the submit button, we are making it load until everything below here finished running.
      setLoading(true);
      // We're setting an error message here
      setError("");
      try {
        // It's connecting to backend.
        const response = await axios.post(
          `${API_BASE}/authentication/signup`,
          {
            email: values.email,
            password: values.password,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        // If no error occured while connecting, it will mark it as "success" and do the codes below setSuccess(true)
        setSuccess(true);
        alert("Registration successful! Welcome aboard!");
        window.location.href = "/login";
      } catch (err) {
        // However, if something wrong happened when trying to connect with backend, setError(err.message) will capture the error message and display it through alert
        setError(err.message);
        alert(`Registration failed: ${err.message}`);
      } finally {
        // Regardless of failiure or success. Once the code finished running, it will no longer be in loading state
        setLoading(false);
      }
    },
  });

  return (
    <div>
      {step === 1 && (
        <Step1 formik={formik} error={error} step={step} setStep={setStep} />
      )}
      {step === 2 && (
        <Step2
          formik={formik}
          loading={loading}
          error={error}
          set={step}
          setStep={setStep}
        />
      )}
    </div>
  );
};

export default Register;
