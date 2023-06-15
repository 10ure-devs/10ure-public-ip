import * as core from "@actions/core";
import { HttpClient } from "@actions/http-client";

/**
 * Action bootstrapper.
 *
 * @export
 */
export async function run(): Promise<void> {
  const maxRetries = parseInt(core.getInput("maxRetries"), 20);
  const http = new HttpClient("haythem/public-ip", undefined, {
    allowRetries: true,
    maxRetries: maxRetries
  });

  let numTries = 0;
  let success = false;
  while (!success && numTries < maxRetries) {
    console.log("retrying to fetch ip info....") 
    try {
      //(Malcolm I Monroe) This url seems to be busted
      //const ipv4 = await http.getJson<IPResponse>(
      //  "https://api.ipify.org?format=json"
      //);

      /*
        https://api64.ipify.org?format=json
        returns the JSON data in the following
        format: 
          {"ip":"96.49.172.42"} // looks like ip4 address

      */
      const ipData = await http.getJson<IPResponse>(
        "https://api64.ipify.org?format=json"
      );

      core.setOutput("ipv4", ipData.result.ip);
      //core.setOutput("ipv6", ipv6.result.ip);

      core.info(`ipv4: ${ipData.result.ip}`);
      //core.info(`ipv6: ${ipv6.result.ip}`);
      success = true;

      if (success == true) {
        console.log("success pulled ip", ipData.result.ip);
      }
    } catch (error) {

      if (numTries == maxRetries - 1) {
        core.setFailed(error?.message);
      }
    }
    numTries++;
  }
}

/**
 * IPify Response.
 *
 * @see https://www.ipify.org/
 */
interface IPResponse {
  ip: string;
}

run();
