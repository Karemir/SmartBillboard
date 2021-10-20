import { registerAs } from "@nestjs/config";

export default registerAs('device', () => ({
    displayScriptPath: process.env.DISPLAY_SCRIPT,
    displayScriptRunner: process.env.SCRIPT_RUNNER,
}));