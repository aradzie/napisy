function prompt(text, validKeys = null) {
  return new Promise((resolve) => {
    const { stdout, stdin } = process;

    // Print the text.
    stdout.write(text);

    // Configure stdin for raw mode.
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();

    // Set up the event listener for key press.
    const onData = (key) => {
      // Ctrl+C or Esc should always exit.
      if (key === "\u0003" || key === "\u001b") {
        process.exit();
      }

      // If validKeys is provided, check if the pressed key is valid.
      if (validKeys === null || validKeys.includes(key)) {
        // Clean up: Remove listener and restore stdin.
        stdin.removeListener("data", onData);
        stdin.setRawMode(false);
        stdin.pause();

        // Resolve with the pressed key.
        resolve(key);
      }
    };

    // Attach the listener
    stdin.on("data", onData);
  });
}

export { prompt };
