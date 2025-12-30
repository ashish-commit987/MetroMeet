import jwt from 'jsonwebtoken';

export const generateToken=(email)=>{
    const token=jwt.sign({email:email},'PHATENDRASINGH',{expiresIn:'1h'});
    return token;
}

export const verifyToken=(token)=>{
    const decode=jwt.verify(token,'PHATENDRASINGH');
    return decode.email;
}