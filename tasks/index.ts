import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });
export * from './blockTime';
export * from './timeMachine';