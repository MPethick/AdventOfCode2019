## Available Scripts

In each of the day-XX project directories, you can run:

### `yarn build`

This will transpile the TypeScript files (.ts) into JavaScript files (.js) for running using Node. The new JavaScript files are created inside a folder called `build` within the project directory.

You will see completion messages in the console once the code has been transpiled.

### `yarn run`

This will run the transpiled JavaScript code using node. To run this command, the JavaScript files will need to have been generated by previously executing the command `yarn build`.

You will see completion messages in the console when the JavaScript code has been successfully ran.


### `yarn start`

This combines the `yarn build` and `yarn run` commands into a single easy to use command.

You will see completion messages in the console once the code has been transpiled and successfully ran.