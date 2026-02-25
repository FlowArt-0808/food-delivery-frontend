"use client";

import Image from "next/image";
import UserFormImage from "../../_components/images/UserFormImage.png";
import Backbutton from "../components/Backbutton";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const Step2 = ({ formik, loading, step, setStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <div className="flex gap-12 items-center justify-center">
      <div className="w-104 pl-25">
        <FieldSet>
          <FieldGroup className="gap-6">
            <Backbutton step={step} setStep={setStep} />

            <Field>
              <FieldLabel className="text-[24px] text-[#09090B] font-semibold">
                Create a strong password
              </FieldLabel>

              <FieldDescription className="text-[16px] font-400 text-[#71717A]">
                Create a strong password with letters, numbers.
              </FieldDescription>
            </Field>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.confirmPassword &&
              formik.touched.confirmPassword && (
                <div className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </div>
              )}

            <Button type="button" onClick={handleSubmit} disabled={loading}>
              <div>{loading ? "Creating Account..." : "Create Account"}</div>
            </Button>

            <div
              aria-label="Section to login"
              className="flex items-center justify-center text-[16px] gap-3"
            >
              Already have an account?{" "}
              <a href="http://localhost:3000/login" className="text-[#2563EB]">
                Log in
              </a>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>

      <Image
        src={UserFormImage}
        alt="Signup form visual"
        className="h-[904px] w-[856px] rounded-md object-cover pr-5"
        priority
      />
    </div>
  );
};

export default Step2;
