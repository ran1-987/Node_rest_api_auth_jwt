import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const FileController = {
    uploadFile: (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        return res.status(200).json({
            message: 'File uploaded successfully',
            fileName: req.file.filename,
            filePath: `/uploads/${req.file.filename}`,
        });
    },

    listFiles: (req, res) => {
        const directoryPath = path.join(__dirname, '../uploads');
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return res.status(500).json({ message: 'Unable to scan files!', error: err.message });
            }
            res.status(200).json({
                message: 'Files retrieved successfully',
                files: files.map(file => ({ name: file, url: `http://your-server-address/uploads/${file}` })),
            });
        });
    }
};
