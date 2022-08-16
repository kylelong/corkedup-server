const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateRegisterInput,
  validateLoginInput,
  validateZipCode
} = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

function generateToken(user) {
  return jwt.sign(
    {
        id: user.id,
        email: user.email,
        zipCode: user.zipCode,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Mutation: {
    async updateZipcode(
      _, 
      {
        zipCodeInput: { email, zipCode }
      }
    
      ){
      const { errors, valid } = validateZipCode(email, zipCode);

      if(!valid){
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError('Account not found.', { 
          errors: {
          general: 'Account not found'
        }
       });
      }

      user.zipCode = zipCode;
      const res = await user.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };



    },
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        errors.general = 'Account not found.';
        throw new UserInputError('Account found.', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Invalid crendetials.';
        throw new UserInputError('Invalid credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register(
      _,
      {
        registerInput: { firstName, lastName, zipCode, email, password }
      }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        firstName,
        lastName,
        zipCode,
        email,
        password
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      // TODO: Make sure user doesnt already exist
      const user = await User.findOne({ email});
      if (user) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'This email is taken'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        firstName,
        lastName,
        zipCode,
        email,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};