#!/usr/bin/env bash

aws s3 cp .env.production s3://bad-bank-env/badbank.env --profile=msk-personal