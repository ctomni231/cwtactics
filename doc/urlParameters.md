| Parameter       | Values           | Default | Description                                                 |
|:----------------|:-----------------:|:-------:|:------------------------------------------------------------|
| skipEnvCheck    | true,false       | false   | If true then the game skips the environment check. This means the "Your system is unsupported..." message never appear. |
| noTests         | true,false       | false   | If true then the game skips the game test phase. |
| noTestErrorLog  | true,false       | false   | If true then the test manager don't logs the stack traces of failed tests. |
| disabledLoggers | string(,string)* | ""      | Contains a comma separated list of class names. The loggers for the given classes are deactivated (e.g. disabledLoggers=UserInteractionData,IoCContainer) |
