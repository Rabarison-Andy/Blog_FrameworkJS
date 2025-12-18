import express from 'express';

router.post('/register', register);
router.post('/login', login);

// Protéger toutes les routes suivantes
router.use(protect);

router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.patch('/updatePassword', updatePassword);
