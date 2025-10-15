import passport from "passport";
import config from "./env.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { findOneUserbyId } from "../repositories/user-repo.js";

export default function configPassport() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretKey,
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await findOneUserbyId(jwt_payload._id);

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
}
