import Loader from './loader';

class AppLoader extends Loader {
  constructor() {
    const apiUrl: string = process.env.API_URL ?? '';
    const apiKey: string = process.env.API_KEY ? String(process.env.API_KEY) : '';
    super(apiUrl, { apiKey });
  }
}

export default AppLoader;
