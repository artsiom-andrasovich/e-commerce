import { TCreateUser, TSignIn } from "@app/lib-shared-types";
import { Token } from "@tokens/model/tokens.schema";
import { tokensService } from "@tokens/tokens.service";
import { User } from "@users/model/users.schema";
import { usersService } from "@users/users.service";
import { ApiError } from "@utils";
import bcrypt from "bcrypt";

class AuthService {
  public async signIn(dto: TSignIn, agent: string) {
    const user = await User.findOne({ email: dto.email }).exec();
    if (!user) {
      throw ApiError.Unauthorized("Invalid email or password");
    }

    if (!user.password) throw ApiError.BadRequest("User has no password");
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.Unauthorized("Invalid email or password");
    }

    const tokens = await tokensService.generateTokens(
      {
        id: user.id,
        email: user.email,
      },
      agent,
    );
    return tokens;
  }

  public async signUp(dto: TCreateUser, agent: string) {
    const user = await usersService.save(dto);
    if (!user) {
      throw ApiError.BadRequest("");
    }
    const tokens = await tokensService.generateTokens(
      {
        id: user.id,
        email: user.email,
      },
      agent,
    );
    return { user, tokens };
  }

  public async signOut(refreshToken: string) {
    return tokensService.deleteRefreshToken(refreshToken);
  }

  public async refreshTokens(refreshToken: string, agent: string) {
    if (!refreshToken) {
      throw ApiError.Unauthorized("No refresh token provided");
    }
    const tokenDoc = await Token.findOne({ token: refreshToken })
      .populate("user")
      .exec();
    if (!tokenDoc) {
      throw ApiError.Unauthorized("Invalid refresh token");
    }

    if (!tokenDoc.exp || new Date() > new Date(tokenDoc.exp as any)) {
      await Token.deleteOne({ token: refreshToken });
      throw ApiError.Unauthorized("Refresh token expired");
    }

    const populatedUser = tokenDoc.user as any;
    const tokens = await tokensService.generateTokens(
      {
        id: populatedUser.id,
        email: populatedUser.email,
      },
      agent,
    );
    return tokens;
  }

  public async deleteRefreshToken(refreshToken: string) {
    return tokensService.deleteRefreshToken(refreshToken);
  }
}

export const authService = new AuthService();
