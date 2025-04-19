const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function niceTry(options, func, ...args) {
  const { maxRetries = 3, initialBackoff = 1000, maxBackoff = 10000 } = options;

  let retries = 0;
  let backoff = initialBackoff;

  while (true) {
    try {
      return await func(...args);
    } catch (error) {
      console.warn(error);
      if (retries >= maxRetries) {
        throw error;
      }
      console.warn(`Error occurred. Retrying in ${backoff / 1000} seconds... (Attempt ${retries + 1}/${maxRetries})`);
      await sleep(backoff);
      retries++;
      backoff = Math.min(backoff * 2, maxBackoff);
    }
  }
}

export { niceTry };
