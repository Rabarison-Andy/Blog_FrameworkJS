const signToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

exports.register = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        nom: req.body.nom,
        email: req.body.email,
        password: req.body.password
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        success: true,
        token,
        data: { user: newUser }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email et mot de passe requis', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Email ou mot de passe incorrect', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
        success: true,
        token,
        data: { user }
    });
});