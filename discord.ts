import fetch from 'node-fetch';

interface DiscordProps {
    balance: string;
    lastBalance: string;
    apy: number;
}

export const sendWebhook = async (props: DiscordProps) => {
    const webhook = process.env.WEBHOOK;
    if(!webhook) throw new Error(`Undefined .env value: 'WEBHOOK'`);
    const diff = parseFloat(props.balance) - parseFloat(props.lastBalance);
    console.info(`Difference: ${diff}`);
    const change = ((parseFloat(props.balance)-parseFloat(props.lastBalance)) / Math.abs(parseFloat(props.lastBalance))) * 100;
    console.info(`Change: ${change}`);
    const apy = (props.apy * 100).toFixed(2)
    let base: number | string | undefined = process.env.FIRST_BALANCE;
    const data = JSON.stringify({
        "content": `${process.env.ROLE ? `<@${process.env.ROLE}> ${props.balance} UST` : ''}`,
        "embeds": [
            {
                "title": "BALANCE UPDATE 💰", "color": 7340287,
                "fields": [
                    {
                        "name": "Current balance","value": `${props.balance} UST`,"inline": true
                    },
                    {
                        "name": "Last balance 🗓","value": `${props.lastBalance} UST`,"inline": true
                    },
                    {
                        "name": "Difference ➖","value": `+${diff.toFixed(5)} UST`,"inline": true
                    },
                    {
                        "name": "Change 📈","value": `${change.toFixed(2)}%`,"inline": true
                    },
                    {
                        "name": "Current APY","value": `${apy}%`,"inline": true
                    },
                    {
                        "name": "Gains","value": `+${base ? parseFloat(props.balance) - parseFloat(base) : "?"} UST`,"inline": true
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