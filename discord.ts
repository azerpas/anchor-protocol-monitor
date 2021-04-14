interface DiscordProps {
    balance: string;
}

export const sendWebhook = async (props: DiscordProps) => {
    const webhook = process.env.WEBHOOK;
    if(!webhook) throw new Error(`Undefined .env value: 'WEBHOOK'`);
    const data = JSON.stringify({
        "content": null,
        "embeds": [
            {
                "title": "BALANCE UPDATE 💰", "color": 7340287,
                "fields": [
                    {
                        "name": "Balance","value": `${props.balance} aUST`,"inline": true
                    },
                ],
                "footer": {  "text": "Anchor Protocol" }, "timestamp": new Date().toISOString()
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: data
    };
    await fetch(webhook, requestOptions);
}