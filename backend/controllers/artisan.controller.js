import Artisan from '../models/Artisan.model.js';

const updateProfile = async (req, res) => {
    try {
        const artisan = await Artisan.findOne({ userId: req.user._id });
        if (!artisan) {
            return res.status(400).json({ message: 'Artisan not found' });
        }

        if (req.body.shopName) artisan.shopName = req.body.shopName;
        if (req.body.bio) artisan.bio = req.body.bio;
        if (req.body.contactNumber)
            artisan.contactNumber = req.body.contactNumber;

        if (req.body.address) {
            artisan.address = {
                ...artisan.address.toObject(),
                ...req.body.address,
            };
        }

        await artisan.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            artisan,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error updating profile',
            error: err.message,
        });
    }
};

export { updateProfile };
