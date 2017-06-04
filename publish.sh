#!/usr/bin/env bash

# deploy to AWS
LOCATION=pics.timgallant.us
DIR=build/
aws s3 sync $DIR s3://$LOCATION --region us-west-2
