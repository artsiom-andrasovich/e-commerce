import { TCreateUser, TSignIn } from "@app/lib-shared-types";
import { env } from "@configs";
import { ApiError, extractAgent, extractCookie } from "@utils";
import { NextFunction, Request, Response } from "express";
import { tokensService } from "@tokens/tokens.service";
import { authService } from "./auth.service";

const REFRESH_TOKEN = "refreshToken";

class AuthController {
  public async signIn(
    req: Request<any, any, TSignIn>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const agent = extractAgent(req);
      const tokens = await authService.signIn(dto, agent);

      tokensService.setRefreshTokenToCookies(tokens, res);
      res.status(201).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  public async signUp(
    req: Request<any, any, TCreateUser>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const agent = extractAgent(req);
      const { user, tokens } = await authService.signUp(dto, agent);

      tokensService.setRefreshTokenToCookies(tokens, res);
      return res.status(201).json({ user, accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  public async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = extractCookie(req, REFRESH_TOKEN);
      if (refreshToken) {
        await authService.deleteRefreshToken(refreshToken);
        res.cookie(REFRESH_TOKEN, "", {
          httpOnly: true,
          secure: env.NODE_ENV === "prod",
          expires: new Date(0),
          path: "/",
        });
      }
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async refreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = extractCookie(req, REFRESH_TOKEN);
      const agent = extractAgent(req);
      if (!refreshToken) {
        throw ApiError.Unauthorized();
      }

      const tokens = await authService.refreshTokens(refreshToken, agent);
      if (!tokens) {
        throw ApiError.Unauthorized();
      }
      tokensService.setRefreshTokenToCookies(tokens, res);

      res.status(201).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
