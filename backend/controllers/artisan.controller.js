import Artisan from '../models/Artisan.model.js';

const updateProfile = async (req, res) => {
    try {
        const artisanId = req.params.id;
        const { shopName, bio, contactNumber, address } = req.body;

        if (!shopName || !bio || !contactNumber || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const artisan = await Artisan.findByIdAndUpdate(
            artisanId,
            { shopName, bio, contactNumber, address },
            { new: true }
        );
        if (!artisan) {
            return res.status(400).json({ message: 'Artisan not found' });
        }

        return res
            .status(200)
            .json({ message: 'Profile updated successfully', artisan });
    } catch (err) {
        return res.status(500).json({
            message: 'Error updating profile',
            error: err.message,
        });
    }
};

export { updateProfile };
