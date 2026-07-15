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
  public hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  public async generateTokens(
    user: TJwtPayload,
    agent: string,
  ): Promise<Tokens> {
    logger.info(`Generating tokens for user: ${user.id}`);

    const payload: TJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const rawToken = crypto.randomUUID();
    const refreshToken = await this.upsertRefreshToken(user.id, agent, rawToken);
    return { accessToken, refreshToken };
  }

  public async deleteRefreshToken(token: string) {
    const hashedToken = this.hashToken(token);
    return Token.deleteMany({ token: hashedToken });
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
    rawToken: string,
  ): Promise<TokenType> {
    const existingToken = await Token.findOne({
      user: userId,
      userAgent: agent,
    });

    const exp = new Date();
    exp.setDate(exp.getDate() + 30);
    const hashedToken = this.hashToken(rawToken);

    if (existingToken) {
      existingToken.token = hashedToken;
      existingToken.exp = exp;
      await existingToken.save();
      const result = existingToken.toJSON() as TokenType;
      result.token = rawToken;
      return result;
    }

    const newToken = await Token.create({
      token: hashedToken,
      exp,
      user: userId,
      userAgent: agent,
    });

    const result = newToken.toJSON() as TokenType;
    result.token = rawToken;
    return result;
  }
}

export const tokensService = new TokensService();
