"use client";

import Image from "next/image";
import Link from "next/link";
import UserFormImage from "../../_components/images/UserFormImage.png";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const Step1 = ({ formik, setStep }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <div className="flex items-center justify-center gap-12">
      <div className="w-104 pl-25">
        <FieldSet>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel className="text-[24px] text-[#09090B] font-semibold">
                Create your account
              </FieldLabel>

              <FieldDescription className="text-[16px] font-400 text-[#71717A]">
                Sign up to explore your favorite dishes.
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

            <Button type="submit" onClick={() => setStep(2)}>
              <div>Lets Go</div>
            </Button>

            <div
              aria-label="Section to login"
              className="flex items-center justify-center text-[16px] gap-3"
            >
              Already have an account?{" "}
              <Link href="/login" className="text-[#2563EB]">
                Log in
              </Link>
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

export default Step1;
