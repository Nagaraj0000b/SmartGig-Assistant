const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // If the user exists but doesn't have a googleId, add it
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // 2. If not, create a new user
        // We use a dummy passwordHash since they are authenticating via Google
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          // Users signing up via Google won't have a local password
          // This ensures they don't break the model validation
          passwordHash: "google_oauth_no_password", 
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// We won't use sessions (since we use JWT), but passport needs these defined to not complain
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = passport;
