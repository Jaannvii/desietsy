import Artisan from '../models/Artisan.model.js';
import User from '../models/User.model.js';

const getProfile = async (req, res) => {
    try {
        const artisan = await Artisan.findOne({ userId: req.user._id });
        if (!artisan) {
            return res.status(404).json({ message: 'Artisan not found' });
        }

        return res.status(200).json({
            _id: artisan._id,
            shopName: artisan.shopName,
            bio: artisan.bio,
            contactNumber: artisan.contactNumber,
            address: artisan.address,
            isVerified: artisan.isVerified,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error fetching profile',
            error: err.message,
        });
    }
};

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

const deleteArtisan = async (req, res) => {
    try {
        const artisan = await Artisan.findById(req.params.id);
        if (!artisan) {
            return res.status(400).json({ message: 'Artisan not found' });
        }
        await Artisan.findByIdAndDelete(req.params.id);
        await User.findByIdAndDelete(artisan.userId);
        return res
            .status(200)
            .json({ message: 'Artisan deleted successfully' });
    } catch (err) {
        return res.status(500).json({
            message: 'Error deleting artisan',
            error: err.message,
        });
    }
};

export { getProfile, updateProfile, deleteArtisan };
