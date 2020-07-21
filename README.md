# dd-trace bug example

This reproduces [issue #1034](https://github.com/DataDog/dd-trace-js/issues/1034) for the dd-trace-js lib.

## Running
Set API Key to env
```
❯ export DD_API_KEY=<the-actual-key>
```
Start postgres and the agent
```
❯ docker-compose up -d postgres agent
```
Wait until containers are up and healthy
```
❯ docker-compose ps
          Name                        Command                 State                  Ports
------------------------------------------------------------------------------------------------------
dd-trace-test_agent_1      /init                           Up (healthy)   8125/udp,
                                                                          0.0.0.0:8126->8126/tcp
dd-trace-test_postgres_1   docker-entrypoint.sh postgres   Up             0.0.0.0:5432->5432/tcp
```
Execute script
```
❯ docker-compose up script
```
