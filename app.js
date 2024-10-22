// import express from 'express';
// import Datastore from 'nedb-promises';
// import bcryptjs from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { config } from './config.js';
// import { data } from './dummy.js'
// import multer from 'multer';
// import path  from 'path';
// import cors from 'cors';
// import fs from 'fs';
// import { fileURLToPath } from 'url'; 
// import { dirname } from 'path'; 

// const app = express();

// // Define __dirname for ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
// }));
// const db = Datastore.create({ filename: 'uploads.db', autoload: true });

// // Set up Multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid overwriting
//     }
// });
// const upload = multer({ storage: storage });
// // app.use('/uploads', express.static('uploads'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Endpoint for uploading files
// app.post('/api/upload', upload.single('file'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }
//     return res.status(200).json({
//         message: 'File uploaded successfully',
//         fileName: req.file.filename,
//         filePath: `/uploads/${req.file.filename}`,
//     });
// });


// app.use(express.json());
// const users = Datastore.create('db/Users.db');
// const userRefreshTokens = Datastore.create('db/UserRefreshTokens.db');
// const userInvalidTokens = Datastore.create('db/userInvalidTokens.db');

// app.get('/api', (req, res) => {
//     res.send('REST API Authentication and Authorization');
// });
// app.get('/api/files', (req, res) => {
//     const directoryPath = path.join(__dirname, 'uploads');
    
//     // Read the uploads directory
//     fs.readdir(directoryPath, (err, files) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Unable to scan files!',
//                 error: err.message
//             });
//         }     
            
//         // Return the list of file names
//         res.status(200).json({
//             message: 'Files retrieved successfully',
//             files: files.map(file => ({
//                 name: file,
//                 url: `http://your-server-address/uploads/${file}` // Replace with your server address
//             }))
//         });
//     });
// });
// app.get('/api/employee', (req, res) => {
//     res.send(data);
// });
// app.post('/api/auth/register', async (req, res) => {
//     try {
//         const { name, email, password, role, userName } = req.body;
//         if (!name || !email || !password) {
//             return res.status(422).json({ message: 'Please fill in all fields (name , email, password)' })
//         }
//         if (await users.findOne({ email })) {
//             return res.status(409).json({ message: 'Email already exists' });
//         }
//         const hasedPassword = await bcryptjs.hash(password, 10);

//         const newUser = await users.insert({
//             name,
//             email,
//             password: hasedPassword,
//             role: role ?? 'member',
//             userName,
//         });
//         return res.status(201).json({ message: 'User Registered Successfully', id: newUser._id })

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         })
//     };

// })

// app.post('/api/auth/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             res.status(422).json({ message: 'Please Fill in all fields (email and password)' })
//         }
//         const user = await users.findOne({ email })
//         if (!user) {
//             return res.status(401).json({ message: 'Email or password is invalid' })
//         }
//         const passwordMatch = await bcryptjs.compare(password, user.password);
//         if (!passwordMatch) {
//             return res.status(401).json({ message: 'Email or password is invalid' })
//         }
//         const accessToken = jwt.sign({ userId: user._id }, config.accessTokenSecret, { subject: 'accessApi', expiresIn: config.accessTokenExpiresIn });
//         const refreshToken = jwt.sign({ userId: user._id }, config.refreshTokenSecret, { subject: 'refreshToken', expiresIn: config.refreshTokenExpiresIn });
//         await userRefreshTokens.insert({
//             refreshToken,
//             userId: user._id
//         })
//         return res.status(200).json({
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             accessToken,
//             refreshToken
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         })
//     };
// });
// app.post('/api/auth/refresh-token', async (req, res) => {
//     try {
//         const { refreshToken } = req.body;
//         if (!refreshToken) {
//             return res.status(401).json({ message: 'Refresh Token Not Found' })
//         }
//         const decodeRefreshToken = jwt.verify(refreshToken, config.refreshTokenSecret);
//         const userRefreshToken = await userRefreshTokens.findOne({ refreshToken, userId: decodeRefreshToken.userId });



//         if (!userRefreshToken) {
//             return res.status(401).json({ message: 'Refresh token invalid or expired' })
//         }

//         await userRefreshTokens.remove({ _id: userRefreshToken._id });
//         await userRefreshTokens.compactDatafile();
//         const accessToken = jwt.sign({ userId: decodeRefreshToken.userId }, config.accessTokenSecret, { subject: 'accessApi', expiresIn: config.accessTokenExpiresIn });
//         const newRefreshToken = jwt.sign({ userId: decodeRefreshToken.userId }, config.refreshTokenSecret, { subject: 'refreshToken', expiresIn: config.refreshTokenExpiresIn });
//         await userRefreshTokens.insert({
//             refreshToken: newRefreshToken,
//             userId: decodeRefreshToken.userId
//         })
//         return res.status(200).json({
//             accessToken,
//             refreshToken: newRefreshToken
//         })

//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
//             return res.status(401).json({ message: 'Refresh token invalid or expired' })
//         }
//         return res.status(500).json({
//             message: error.message
//         })
//     }
// })
// app.get('/api/auth/logout', ensureAthenticated, async (req, res) => {
//     try {
//         await userRefreshTokens.removeMany({ userId: req.user.id });
//         await userRefreshTokens.compactDatafile();
//         await userInvalidTokens.insert({
//             accessToken: req.accessToken.value,
//             userId: req.user.id,
//             exprirationTime: req.accessToken.exp
//         });

//         return res.status(204).send();
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         })
//     }
// })
// app.get('/api/users/current', ensureAthenticated, async (req, res) => {

//     try {
//         const user = await users.findOne({ _id: req.user.id })

//         return res.status(200).json({
//             id: user._id,
//             name: user.name,
//             email: user.email
//         })

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         })
//     }
// })

// app.get('/api/admin', ensureAthenticated, authorize(['admin']), (req, res) => {
//     return res.status(200).json({ message: 'Only admin can access this route!' })
// })
// app.get('/api/moderator', ensureAthenticated, authorize(['admin', 'moderator']), (req, res) => {
//     return res.status(200).json({ message: 'Only admin and moderator can access this route!' })
// })
// async function ensureAthenticated(req, res, next) {
//     const accessToken = req.headers.authorization;
//     if (!accessToken) {
//         return res.status(401).json({ message: 'Access token not found' })
//     }
//     if (await userInvalidTokens.findOne({ accessToken })) {
//         return res.status(401).json({ message: 'Access token invalid', code: 'AccessTokenInvalid' })
//     }
//     try {
//         const decodedAccessToken = jwt.verify(accessToken, config.accessTokenSecret);
//         req.accessToken = { value: accessToken, exp: decodedAccessToken.exp }
//         req.user = { id: decodedAccessToken.userId }
//         next()

//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError) {
//             return res.status(401).json({ message: 'Access token expired', code: 'AccessTokenExpired' })
//         } else if (error instanceof jwt.JsonWebTokenError) {
//             return res.status(401).json({ message: 'Access token invalid', code: 'AccessTokenInvalid' })
//         } else {
//             return res.status(500).json({
//                 message: error.message
//             })
//         }
//     }
// }
// function authorize(roles = []) {
//     return async function (req, res, next) {
//         const user = await users.findOne({ _id: req.user.id })
//         if (!user || !roles.includes(user.role)) {
//             return res.status(403).json({ message: 'Access denied' })
//         }
//         next();
//     }
// }



// app.listen(3000, () => {
//     console.log('Server Started on Port 3000')
// })


import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api', (req, res) => {
    res.send('Welcome to the Node.js Application!');
});
app.use('/uploads', express.static('uploads'));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', fileRoutes);

app.listen(4000, () => {
    console.log('Server started on port 4000');
});
