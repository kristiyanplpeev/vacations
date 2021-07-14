import { configService } from '../config/config-service';
const fs = require('fs');

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeOrmConfig(), null, 2),
);
