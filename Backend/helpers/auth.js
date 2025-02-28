import dotenv from 'dotenv'
import bcrypt, { hash } from 'bcryptjs'

dotenv.config();

const {genSalt,hash: _hash,compare}=bcrypt

//function for hash password

const hashPassword =(password)=>{
    return new Promise((resolve, reject) => {
        genSalt(12,(err,salt)=>{
            if(err) reject(err);
            _hash(password,salt,(err,hash)=>{
                if(err) reject(err);
                resolve(hash)
            })
        })
    })
};

const comparePassword = (password,hashed) =>{
    return compare(password,hashed)
}

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        // Check if the logged-in user is a super admin
        if (user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied. Only superadmins can perform this action.' });
        }

        req.userId = user.id;
        next();
    });
};


export default{
    hashPassword,
    comparePassword,
    authenticate
}