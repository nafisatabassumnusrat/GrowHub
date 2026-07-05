'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const roles = ['Farmer', 'Fisherman', 'Buyer', 'Resident'] as const;

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  upazila: z.string().min(1, 'Upazila is required'),
  role: z.enum(roles),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Mock API call
      console.log('Register Data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Registration successful! Welcome to GrowHub.');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-background shadow-extruded border-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Join your hyperlocal community today.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" {...register('fullName')} />
            {errors.fullName && <span className="text-sm text-red-500">{errors.fullName.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" type="tel" placeholder="+8801700000000" {...register('phoneNumber')} />
            {errors.phoneNumber && <span className="text-sm text-red-500">{errors.phoneNumber.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="division">Division</Label>
              <Input id="division" placeholder="e.g. Dhaka" {...register('division')} />
              {errors.division && <span className="text-sm text-red-500">{errors.division.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="district">District</Label>
              <Input id="district" placeholder="e.g. Dhaka" {...register('district')} />
              {errors.district && <span className="text-sm text-red-500">{errors.district.message}</span>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="upazila">Upazila</Label>
            {/* In a real app, this would be a searchable combobox */}
            <Input id="upazila" placeholder="Search for your Upazila..." {...register('upazila')} />
            {errors.upazila && <span className="text-sm text-red-500">{errors.upazila.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(val) => setValue('role', val as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <span className="text-sm text-red-500">{errors.role.message}</span>}
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
