# Build AWS

Compress-Archive -Path .\* -DestinationPath lambda-sendGrid.zip

aws lambda create-function --function-name hire-a-friend-send-grid --runtime nodejs18.x --role arn:aws:iam::173088506843:role/hire-a-friend-send-grid --handler app.handler --zip-file fileb://lambda-sendGrid.zip

aws lambda update-function-code --function-name hire-a-friend-send-grid --zip-file fileb://lambda-sendGrid.zip

command: aws lambda update-function-configuration --function-name YOUR_FUNCTION_NAME --environment "Variables={KEY1=${circle_ci_env1},KEY2=${circle_ci_env2}}"