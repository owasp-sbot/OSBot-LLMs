#!/bin/bash

uvicorn osbot_llms.lambdas.handler:app --reload --host 0.0.0.0 --port 8080