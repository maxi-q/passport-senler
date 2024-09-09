import axios from 'axios';
import { Strategy as OAuth2Strategy, StrategyOptions, VerifyFunction } from 'passport-oauth2';

interface SenlerStrategyOptions extends StrategyOptions {
  groupID?: string;
  clientSecret: string;
  callbackURL: string;
}

const authorizationURL = 'https://senler.ru/cabinet/OAuth2authorize';
const tokenURL = 'https://senler.ru/ajax/cabinet/OAuth2token';

export class SenlerStrategy extends OAuth2Strategy {
  private _clientSecret: string;
  private _tokenURL: string;
  private _clientID: string;
  private _groupID: string;
  private _callbackURL: string;

  constructor(options: Omit<SenlerStrategyOptions, 'authorizationURL' | 'tokenURL'>, verify?: VerifyFunction) {
    options.groupID = options.groupID || '';

    super({ ...options, authorizationURL, tokenURL }, verify || (() => {}));

    this.name = 'senler';

    this._clientSecret = options.clientSecret;
    this._callbackURL = options.callbackURL;
    this._groupID = options.groupID || '';
    this._tokenURL = tokenURL;
    this._clientID = options.clientID;
  }

  async authenticate(req: any, options?: object): Promise<void> {
    const authorizationCode = req.query.code;
    this._groupID = req.query.group_id;

    if (!authorizationCode) {
      console.error('authorizationCode is missing in response');
      return super.authenticate(req, options);
    }

    try {
      const accessToken = await this.getAccessToken(authorizationCode);
      this.success({ accessToken });
    } catch (error) {
      this.fail(`Failed to exchange authorization code: ${error}`);
    }
  }

  async getAccessToken(authorizationCode: string): Promise<string> {
    try {
      const response = await axios.get(this._tokenURL, {
        params: {
          grant_type: 'authorization_code',
          client_id: this._clientID,
          client_secret: this._clientSecret,
          redirect_uri: this._callbackURL, // Must match the registered callback URL
          code: authorizationCode,
          group_id: this._groupID,
        },
      });

      if (response.data && response.data.access_token) {
        return response.data.access_token;
      }

      throw new Error('No access token in response');
    } catch (error) {
      throw new Error(`Failed to get access token: ${error}`);
    }
  }
}
