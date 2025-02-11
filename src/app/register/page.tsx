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
});

type FormValues = z.infer<typeof formSchema>;
export default function RegistrationForm() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true); // Disable button
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
      } else {
        toast.error(`Failed to register : ${result.message}`, {
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
      toast.error(`Failed to register : ${error}`, {
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
      setIsSubmitting(false); // Re-enable button
    }
  };

  if (!isMounted) {
    return null; // Avoids hydration error
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
      <div className="max-w-5xl md:w-1/3 p-6 shadow-lg rounded-lg h-auto border border-slate-200 text-white m-6">
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
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="prefer not to say">Prefer not to say</SelectItem>
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
                          <SelectItem value="2028">2028</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
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

            {/* Branch and Section Fields */}
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="p-6">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                          <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                          <SelectItem value="Computer Science and Engineering">Computer Science and Engineering</SelectItem>
                          <SelectItem value="CS AI/ML">CS AI/ML</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</SelectItem>
                          <SelectItem value="Electronics and Telecommunication Engineering">Electronics and Telecommunication Engineering</SelectItem>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Metallurgy and Materials Engineering">Metallurgy and Materials Engineering</SelectItem>
                          <SelectItem value="Production Engineering">Production Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="p-6">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                          <SelectItem value="H">H</SelectItem>
                          <SelectItem value="I">I</SelectItem>
                          <SelectItem value="J">J</SelectItem>
                          <SelectItem value="K">K</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="N">N</SelectItem>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="p-6">
                          <SelectValue placeholder="Primary domain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Dev">Web Dev</SelectItem>
                          <SelectItem value="App Dev">App Dev</SelectItem>
                          <SelectItem value="Game Dev">Game Dev</SelectItem>
                          <SelectItem value="AI/ML">AI/ML</SelectItem>
                          <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                          <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                          <SelectItem value="UI/UX">UI/UX</SelectItem>
                          <SelectItem value="Blender">Blender</SelectItem>

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
                          <SelectItem value="Web Dev">Web Dev</SelectItem>
                          <SelectItem value="App Dev">App Dev</SelectItem>
                          <SelectItem value="Game Dev">Game Dev</SelectItem>
                          <SelectItem value="AI/ML">AI/ML</SelectItem>
                          <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                          <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                          <SelectItem value="UI/UX">UI/UX</SelectItem>
                          <SelectItem value="Blender">Blender</SelectItem>

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
