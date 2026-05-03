import jwt from "jsonwebtoken";

const SECRET = 'MHNHfw2qmktpS5fWRe5GTZtdHx5KTpi3rDMPXmB5bSH';

const generateToken = (payload: object): string => {
    return jwt.sign(payload, SECRET, {expiresIn: "7d"});
}

const verifyToken = (token: string): any =>{
    return jwt.verify(token, SECRET);
}

export {generateToken, verifyToken};