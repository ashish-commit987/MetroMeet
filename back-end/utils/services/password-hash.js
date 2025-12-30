import bcrypt from 'bcrypt';

export const encryptPassword=(plainPassword)=>{
    return bcrypt.hashSync(plainPassword,parseInt(process.env.SALT));
}

export const compareHash=(plainPassword,dbPassword)=>{
    return bcrypt.compareSync(plainPassword,dbPassword);
}