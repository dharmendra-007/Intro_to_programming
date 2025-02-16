"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CgSpinner } from "react-icons/cg";
import Image from "next/image";

// Form Options
const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer not to say", label: "Prefer not to say" }
];

const GRADUATION_YEARS = [2028, 2027, 2026];

const BRANCHES = [
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Science and Engineering",
  "CS AI/ML",
  "Electrical Engineering",
  "Electrical and Electronics Engineering",
  "Electronics and Telecommunication Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Metallurgy and Materials Engineering",
  "Production Engineering"
];

const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];

const DOMAINS = [
  "Web Dev",
  "App Dev",
  "Game Dev",
  "AI/ML",
  "Cyber Security",
  "Cloud Computing",
  "UI/UX",
  "Blender",
  "Video Editing",
  "GD"
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  gender: z.string().nonempty({ message: "Please select your gender." }),
  graduationYear: z.number({ required_error: "Please select your graduation year." }),
  email: z.string().email({ message: "Invalid email address." }),
  registrationNumber: z.string().regex(/^\d{10}$/, { message: "Registration number must be 10 digits." }),
  branch: z.string().nonempty({ message: "Please select your branch." }),
  section: z.string().nonempty({ message: "Please select your section." }),
  whatsappNo: z.string().regex(/^\d{10}$/, { message: "WhatsApp number must be 10 digits." }),
  primaryDomain: z.string().nonempty({ message: "Please select your primary domain." }),
  secondaryDomain: z.string().nonempty({ message: "Please select your secondary domain." }),
}).refine((data) => data.primaryDomain !== data.secondaryDomain, {
  message: "Primary and secondary domains must be different",
  path: ["secondaryDomain"],
});

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSecondaryDomains, setAvailableSecondaryDomains] = useState(DOMAINS);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      graduationYear: undefined,
      email: "",
      registrationNumber: "",
      branch: "",
      section: "",
      whatsappNo: "",
      primaryDomain: "",
      secondaryDomain: "",
    },
  });

  const handlePrimaryDomainChange = (value: string) => {
    form.setValue("primaryDomain", value);
    form.setValue("secondaryDomain", "");
    setAvailableSecondaryDomains(DOMAINS.filter(domain => domain !== value));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://rfbe.vercel.app/api/v1/students/newregestration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Registration successful', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        form.reset();
        setAvailableSecondaryDomains(DOMAINS);
      } else {
        toast.error(`Failed to register: ${result.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error(`Failed to register: ${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-auto bg-black relative overflow-x-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Image src='/images/Enigma.png' height={80} width={80} alt="logo" className="absolute sm:top-8 sm:left-8 max-sm:hidden z-10 cursor-pointer" onClick={() => (location.href = '/')} />
      <div className="w-full max-w-5xl md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 shadow-lg rounded-lg h-auto border border-slate-200 text-white m-6">
        <Image src='/images/Enigma.png' height={50} width={50} alt="logo" className="mx-auto sm:hidden"/>
        <h1 className="text-3xl font-bold mb-4 text-center font-life-style-regular">Registration Form</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="placeholder:text-white text-white p-6" placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender and Graduation Year Fields */}
            <div className="flex flex-row gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="p-6">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Graduation Year</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        value={field.value?.toString() ?? ""}
                      >
                        <SelectTrigger className="bg-transparent p-6">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADUATION_YEARS.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="placeholder:text-white text-white p-6" placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registration Number Field */}
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input className="placeholder:text-white text-white p-6" placeholder="Enter your registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Branch Field */}
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="p-6">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCHES.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Section Field */}
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="p-6">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTIONS.map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* WhatsApp Number Field */}
            <FormField
              control={form.control}
              name="whatsappNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input className="placeholder:text-white text-white p-6" placeholder="Enter your WhatsApp number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Primary and Secondary Domain Fields */}
            <div className="flex flex-row gap-6">
              <FormField
                control={form.control}
                name="primaryDomain"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Primary Domain</FormLabel>
                    <FormControl>
                      <Select onValueChange={handlePrimaryDomainChange} value={field.value}>
                        <SelectTrigger className="p-6">
                          <SelectValue placeholder="Primary domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAINS.map((domain) => (
                            <SelectItem key={domain} value={domain}>
                              {domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondaryDomain"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Secondary Domain</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="p-6">
                          <SelectValue placeholder="Secondary domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSecondaryDomains.map((domain) => (
                            <SelectItem key={domain} value={domain}>
                              {domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
              {isSubmitting ? <CgSpinner className="animate-spin"/> : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}