FROM python:3.12-slim

RUN pip install mangum uvicorn httpx openai numpy
RUN pip install osbot-aws osbot-fast-api osbot-prefect

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

RUN python --version
ENV PORT=8080

WORKDIR /app
COPY ../../../osbot_llms /app/osbot_llms

ENV PYTHONPATH="/app"

COPY ./deploy/docker/osbot-llms/start.sh /app/start.sh

CMD ["./start.sh"]

