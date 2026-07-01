import { TJwtPayload } from "@app/lib-shared-types";
import { env, logger } from "@configs";
import { ApiError } from "@utils";
import crypto from "crypto";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { Token, TokenType } from "./model/tokens.schema";

export interface Tokens {
  accessToken: string;
  refreshToken: TokenType;
}

class TokensService {
  public async generateTokens(
    user: TJwtPayload,
    agent: string,
  ): Promise<Tokens> {
    logger.info(`Generating tokens for user: ${user.id}`);

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken =
      "Bearer " +
      jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
      });

    const refreshToken = await this.upsertRefreshToken(user.id, agent);
    return { accessToken, refreshToken };
  }

  public async deleteRefreshToken(token: string) {
    return Token.deleteMany({ token });
  }

  public async deleteAllUserTokens(userId: string): Promise<void> {
    await Token.deleteMany({ user: userId });
  }

  public setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens || !tokens.refreshToken) {
      throw ApiError.Unauthorized("No tokens provided");
    }
    res.cookie("refreshToken", tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(tokens.refreshToken.exp),
      secure: env.NODE_ENV === "prod",
      path: "/",
    });
  }

  private async upsertRefreshToken(
    userId: string,
    agent: string,
  ): Promise<TokenType> {
    const existingToken = await Token.findOne({
      user: userId,
      userAgent: agent,
    });

    const tokenString = crypto.randomUUID();
    const exp = new Date();
    exp.setDate(exp.getDate() + 30);

    if (existingToken) {
      existingToken.token = tokenString;
      existingToken.exp = exp;
      await existingToken.save();
      return existingToken.toJSON() as TokenType;
    }

    const newToken = await Token.create({
      token: tokenString,
      exp,
      user: userId,
      userAgent: agent,
    });

    return newToken.toJSON() as TokenType;
  }
}

export const tokensService = new TokensService();
