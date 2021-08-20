# Anchor Protocol Monitor

Using [anchor.js](https://github.com/Anchor-Protocol/anchor.js) and [terra.js](https://github.com/terra-project/terra.js) to fetch the total deposit amount of UST in the Anchor Protocol, avoiding the constant check of the [web app](https://app.anchorprotocol.com/earn) and get a daily update on your savings.    
![webapp](https://user-images.githubusercontent.com/19282069/114839725-664fcc80-9dd6-11eb-957b-03d0c7ecbbda.png)
![webhook](https://user-images.githubusercontent.com/19282069/114916061-a6d63700-9e24-11eb-971e-71d9409e62ca.png)

## How it works
You can use the functions inside `terra.ts` to run the script locally through `index.ts` or a custom script.    
I personnally run the whole process through a Lambda microservice.

### Flow
- `handler.ts` is used to run the function inside AWS.
- A CRON trigger the function each day.
- The functions saves some values in the environnemental variables to reuse next time, thus avoiding the use of a database.
- The function is using [Discord Webhooks](https://discord.com/developers/docs/resources/webhook) to alert the user.

## How to use
### 1. Set-up the AWS Lambda func
#### A. Compress the files and upload the zip to AWS Lambda
- `git clone https://github.com/azerpas/anchor-protocol-monitor.git`
- `npm i && npm run lambda`
- Drag and drop `dist.zip` to a AWS Lambda NodeJS 14.x function
- Define the environnemental variables like the ones inside `.env.template`
- Change the "Handler" inside the Runtime Settings to `handler.handler` instead of the default `index.handler` 
#### B. Use Github actions
- Create a AWS Lambda NodeJS 14.x function
- Define the environnemental variables like the ones inside `.env.template`
- Fork the repository
- Go into your repository secrets inside settings
- Add these values     
    - `AWS_ACCESS_KEY_ID`: the AWS access key obtained through IAM
    - `AWS_SECRET_ACCESS_KEY`: the AWS secret key obtained through IAM
    - `AWS_REGION`: the AWS region of your Lambda func
    - `FUNCTION_NAME`: the AWS Lambda func name
### 2. CRON the function
- Use CloudWatch Event to CRON the function
- `cron(0 12 * * ? *)` to execute the function everyday at 12:00pm    
![AWS_Screenshot](https://user-images.githubusercontent.com/19282069/115397779-c08dca80-a1e6-11eb-8d6c-a3260266618f.png)

## TODO
- [X] Add a initial base deposit in Discord
- [X] Return current APY
