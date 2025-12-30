import z from "zod";

export const registerSchema=z.object({
    email: z.string().min(1,'email is required').email('Please Enter valid mail'),
    password: z.string().min(4,'Password must be of min 4 characters'),
    name: z.string().min(3,'Min length of name is 3')
});

export const loginSchema=z.object({
    email: z.string().min(1,'email is required').email('Please Enter valid mail'),
    password: z.string().min(4,'Password must be of min 4 characters')
});

export type RegisterSchema=z.infer<typeof registerSchema>;
export type LoginSchema=z.infer<typeof loginSchema>;