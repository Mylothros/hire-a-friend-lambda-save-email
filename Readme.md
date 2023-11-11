# Build SAM
sam build

# Package SAM template (test)
sam package --template-file template.yaml --s3-bucket hire-a-friend-emails --output-template-file packaged.development.yaml

sam deploy --template-file packaged.development.yaml --stack-name hire-a-friend-emails --capabilities CAPABILITY_IAM --s3-bucket hire-a-friend-emails --guided