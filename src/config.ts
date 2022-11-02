import { readFileSync } from 'fs';
import path = require('path');
import yaml = require('yaml');

interface ConfigType {
  discord: {
    api_token: string;
  };

  testing: {
    debug: boolean;
    log_level: string;
    guild: string;
  };
}

const Config: Readonly<ConfigType> = (() => {
  const configPath = path.join(__dirname, '..', 'config.yaml');

  const fileContents = readFileSync(configPath).toString('utf-8');
  const configObject = yaml.parse(fileContents) as ConfigType;

  // Config should be Readonly.
  return Object.freeze(configObject);
})();

export { Config };
