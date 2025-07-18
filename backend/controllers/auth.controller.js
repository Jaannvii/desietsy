const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({ message: 'All fields are required' });
        }
        return res
            .status(201)
            .json({ message: `${username} registered successfully` });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { registerUser };
