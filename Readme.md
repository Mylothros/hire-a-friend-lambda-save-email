# Build SAM
aws cloudformation package --template-file template.yaml --s3-bucket hire-a-friend-emails --output-template-file packaged.development.yaml

aws cloudformation deploy --template-file packaged.development.yaml --stack-name hire-a-friend-emails --capabilities CAPABILITY_IAM --s3-bucket hire-a-friend-emails --parameter-overrides Stage=Dev, S3BucketPolicy=arn:aws:iam::173088506843:policy/HireAFriendS3Policy --region us-east-1 