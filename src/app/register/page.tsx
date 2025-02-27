"use client";

import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer not to say", label: "Prefer not to say" }
];

const BRANCHES = [
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Science and Engineering",
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
  "Competitive Programming",
  "Cyber Security",
  "Cloud Computing",
  "UI/UX",
  "Blender",
  "Video Editing",
  "GD",
  "Content Writing"
];

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  gender: z.string().nonempty({ message: "Please select your gender." }),
  email: z.string().email({ message: "Invalid email address." }),
  registrationNumber: z.string().regex(/^\d{10}$/, { message: "Registration number must be 10 digits." }),
  branch: z.string().nonempty({ message: "Please select your branch." }),
  section: z.string().optional().or(z.literal("")),
  whatsappNo: z.string().regex(/^\d{10}$/, { message: "WhatsApp number must be 10 digits." }),
  primaryDomain: z.string().nonempty({ message: "Please select your primary domain." }),
  secondaryDomain: z.string().nonempty({ message: "Please select your secondary domain." }),
  githubUrl: z.string().regex(
    /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9._-]+\/?)?$/,
    { message: "Invalid GitHub URL." }
  ),

  projectLink1: z.string().regex(
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?.*$/,
    { message: "Invalid project link." }
  ).optional().or(z.literal("")),

  projectLink2: z.string().regex(
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?.*$/,
    { message: "Invalid project link." }
  ).optional().or(z.literal("")),

  resumeLink: z.string().regex(
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?.*$/,
    { message: "Invalid resume link." }
  ).optional().or(z.literal("")),

}).refine((data) => data.primaryDomain !== data.secondaryDomain, {
  message: "Primary and secondary domains must be different",
  path: ["secondaryDomain"],
});


type FormValues = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSecondaryDomains, setAvailableSecondaryDomains] = useState(DOMAINS);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      email: "",
      registrationNumber: "",
      branch: "",
      section: "",
      whatsappNo: "",
      primaryDomain: "",
      secondaryDomain: "",
      githubUrl: "",
      projectLink1: "",
      projectLink2: "",
      resumeLink: "",
    },
    mode: "onBlur",
  });

  const handlePrimaryDomainChange = (value: string) => {
    form.setValue("primaryDomain", value);
    form.setValue("secondaryDomain", "");
    setAvailableSecondaryDomains(DOMAINS.filter(domain => domain !== value));
  };

  const onSubmit = async (data: FormValues) => {
    // email in lowercase
    const formattedData = {
      ...data,
      name: data.name.trim(),
      email: data.email.toLowerCase(),
    };

    console.log(formattedData)

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(formattedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value as string);
        }
      });

      const response = await fetch("https://itp-secondyear.vercel.app/api/v1/students/newregestration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Registration successful', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        form.reset();
        setAvailableSecondaryDomains(DOMAINS);
        router.push("https://chat.whatsapp.com/Ey8JkhYMswpLYr5PKpkV1I");
      } else {
        toast.error(`Failed to register: ${result.message || 'Unknown error'}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error(`Failed to register: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
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
      <div className="w-[95%] max-w-5xl md:w-2/3 lg:w-1/2 xl:w-1/3 p-2 md:p-6 shadow-lg rounded-lg h-auto border border-slate-200 text-white my-6">
        <Image src='/images/Enigma.png' height={50} width={50} alt="logo" className="mx-auto sm:hidden" />
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

            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-full">
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
            <div className="flex flex-row justify-between">
              <FormField
                control={form.control}
                name="primaryDomain"
                render={({ field }) => (
                  <FormItem className="w-[48%]">
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
                  <FormItem className="w-[48%]">
                    <FormLabel>Secondary Domain</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="py-6">
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

            {/* GitHub URL Field */}
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github URL</FormLabel>
                  <FormControl>
                    <Input className="placeholder:text-white text-white p-6" placeholder="Enter your Github URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Links */}
            <FormField
              control={form.control}
              name="projectLink1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link 1 (optional)</FormLabel>
                  <FormControl>
                    <Input className="placeholder:text-white text-white p-6" placeholder="Enter your Project Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectLink2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link 2 (optional)</FormLabel>
                  <FormControl>
                    <Input className="placeholder:text-white text-white p-6" placeholder="Enter your Project Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume Link (optional)</FormLabel>
                  <FormControl>
                    <Input className="placeholder:text-white text-white p-6" placeholder="Enter your Resume Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                {isSubmitting ? <CgSpinner className="animate-spin" /> : "Register"}
              </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}