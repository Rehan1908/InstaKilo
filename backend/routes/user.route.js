import express from "express";
import { editProfile, followOrUnfollow, getUser, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from '../utils/isAuthenticated.js'
import upload from '../utils/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getUser);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

export default router;