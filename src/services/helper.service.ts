export class HelperService {
  /**
   * Find cookie by name in array of cookies
   *
   * @param cookies
   * @param name
   * @returns
   */
  getCookieValue(cookies: string[] | undefined, name: string) {
    let cookieValue = null;
    if (cookies) {
      cookies.forEach((cookie) => {
        const splitCookie = cookie.split(";");

        if (splitCookie) {
          const cookieKv = splitCookie[0].split("=");

          if (cookieKv) {
            if (cookieKv[0] === name) {
              cookieValue = cookieKv[1];
            }
          }
        }
      });
    }

    return cookieValue;
  }

  /**
   * Generates random number between given range
   *
   * @param min - starting number
   * @param max - ending number
   * @returns random number between min and max
   */
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateCsrfToken(): string {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Generates device id
   *
   * @returns device id
   */
  generateDeviceId(): number {
    let numbers: number[] = [];

    this.range(19).forEach(() => {
      numbers.push(this.choose(this.range(10)));
    });

    return parseInt(numbers.join(""));
  }

  /**
   * Returns given length of array
   *
   * @param number
   * @returns array of given number series
   */
  range(number: number) {
    return Array.from(Array(number).keys());
  }

  /**
   * Randomly selects a number from given array of numbers
   *
   * @param choices
   * @returns number
   */
  choose(choices: number[]) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }
}
