import axios from 'axios';
import { Strategy as OAuth2Strategy, StrategyOptions } from 'passport-oauth2';

interface SenlerStrategyOptions extends StrategyOptions {
  groupID?: string;
  redirectURI: string;
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

  constructor(options: SenlerStrategyOptions) {
    options.authorizationURL = authorizationURL;
    options.tokenURL = tokenURL;

    options.redirectURI = options.redirectURI;
    options.groupID = options.groupID || '';

    super(options, () => {});

    this.name = 'senler';

    this._callbackURL = options.callbackURL;
    this._groupID = options.groupID || '';
    this._clientSecret = options.clientSecret;
    this._tokenURL = options.tokenURL;
    this._clientID = options.clientID;
  }

  authenticate(req: any, options?: object): void {
    const authorizationCode = req.query.code;
    if (!authorizationCode) {
      return super.authenticate(req, options);
    }

    this.exchangeCodeForToken(authorizationCode)
      .then(response => {
        this.success(response);
      })
      .catch(error => {
        this.fail(`Failed to exchange authorization code: ${error.message}`);
      });
  }

  async exchangeCodeForToken(authorizationCode: string): Promise<string> {
    try {
      const response = await axios.get(this._tokenURL, {
        params: {
          grant_type: 'authorization_code',
          client_id: this._clientID,
          client_secret: this._clientSecret,
          redirect_uri: this._callbackURL, // Должен совпадать с зарегистрированным callback URL
          code: authorizationCode,
          group_id: this._groupID,
        },
      });

      if (response.data && response.data.access_token) {
        return response.data;
      }

      throw new Error('No access token in response');
    } catch (error) {
      throw new Error(`Failed to get access token: ${error}`);
    }
  }
}
